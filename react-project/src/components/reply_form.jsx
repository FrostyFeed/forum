import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import formStyles from './styles/reply_form.module.css'; // Adjust path if needed
import { useAuth } from '../context/AuthContext.jsx'; // Import Auth context
import { useThread } from '../context/ThreadContext.jsx'; // Import Thread context
import { is } from 'date-fns/locale';
import { add } from 'date-fns';
// --- Constants for Quill ---
const modules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'align': ['', 'center', 'right', 'justify'] }],
        ['link', 'image'],
    ],
};

const formats = [
    'bold', 'italic', 'underline',
    'align',
    'link', 'image'
];

// --- Constants for File Upload ---
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

async function deleteImageFromServer(imageUrl) {
    console.log(`Requesting deletion for image: ${imageUrl}`);
    try {
        const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1).split('?')[0];
        if (!filename) {
            console.warn("Could not extract filename for deletion from URL:", imageUrl);
            return; // Or throw, depending on how critical this is
        }
        const response = await axios.delete(`http://localhost:8080/api/img/deleteByName/${filename}`, {
            withCredentials: true,
        });
        if (response.status >= 200 && response.status < 300) {
            console.log(`Successfully requested deletion for image: ${imageUrl}`);
            return response.data;
        } else {
            const errorMsg = response.data?.message || `Image deletion failed for ${imageUrl} with status: ${response.status}`;
            console.error("Image Deletion Response Error:", response);
            // Not throwing here to prevent post update failure due to deletion error
            // throw new Error(errorMsg); 
        }
    } catch (error) {
        console.error(`Axios error during image deletion for ${imageUrl}:`, error);
        // Not throwing here
        // throw new Error(error.message || `Image deletion failed for ${imageUrl}`);
    }
}
// --- Helper Function for File Upload ---
async function uploadFile(file) {
    console.log(`Simulating upload for: ${file.name}`);
    const formData = new FormData();
    formData.append('imageFile', file);
    try {
        const response = await axios.post('http://localhost:8080/api/img', formData, {
            withCredentials: true,
        });
        // Check for successful status code (e.g., 200, 201)
        if (response.status >= 200 && response.status < 300 && response.data?.imageUrl) {
            return response.data.imageUrl;
        } else {
            // Throw an error with more context if possible
            const errorMsg = response.data?.message || `Image upload failed with status: ${response.status}`;
            console.error("Upload Response Error:", response);
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error("Axios Upload Error:", error);
        // Re-throw a more specific error or handle it
        throw new Error(error.message || 'Image upload failed');
    }
}


export default function ReplyForm({ formType = 'reply', parentId, onSuccess, onCancel, threadId, redactedPost, isThread, addReply }) {
    const threadContext = useThread();
    const threadContent = threadContext?.content;
    const [title, setTitle] = useState(isThread ? threadContent.tittle : ''); // State for thread title
    const [pendingFiles, setPendingFiles] = useState(new Map());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth(); // Get user from context
    const isMountedRef = useRef(true);
    const quillRef = useRef(null);
    const fileInputRef = useRef(null);
    const isRedacting = isThread || !(redactedPost == null && isThread == null)

    const [content, setContent] = useState(
        isThread
            ? threadContent?.content ?? ''
            : redactedPost?.content ?? ''
    );
    // --- Cleanup ref on unmount ---
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);


    // --- Set up Quill image handler ---
    useEffect(() => {
        if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            const toolbar = quill.getModule('toolbar');
            toolbar.addHandler('image', () => {
                if (fileInputRef.current) {
                    fileInputRef.current.click();
                }
            });
        }
    }, []);

    // --- Handle File Input ---
    const handleFileInputChange = (event) => {
        const fileInput = event.target;

        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];

            // File Size Check
            if (file.size > MAX_FILE_SIZE_BYTES) {
                alert(`File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`);
                fileInput.value = '';
                return;
            }

            // File Type Check
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert(`Invalid file type. Only PNG, JPEG, JPG, and WEBP are allowed.`);
                fileInput.value = '';
                return;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                if (!isMountedRef.current) return; // Check if component is still mounted

                if (quillRef.current && e.target && typeof e.target.result === 'string') {
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection(true);
                    const base64ImageData = e.target.result;

                    if (!base64ImageData.startsWith('data:image/')) {
                        console.error("FileReader result is not a valid data URL");
                        alert("Error processing the image data.");
                        return;
                    }

                    try {
                        setPendingFiles(prevMap => new Map(prevMap).set(base64ImageData, file));
                        quill.insertEmbed(range.index, 'image', base64ImageData);
                        // Move cursor past the inserted image
                        const range2 = quill.getSelection();
                        if (range2) {
                            quill.focus();
                            setTimeout(() => {
                                quill.setSelection(range2.index + 1, 0);
                            }, 0);
                        }
                    } catch (mapError) {
                        console.error("Error updating pendingFiles map:", mapError);
                        alert("An internal error occurred while preparing the image.");
                    }
                } else if (isMountedRef.current) {
                    console.warn("FileReader onload fired, but Quill ref or event target/result was invalid.");
                    alert("Could not insert the image due to an unexpected issue.");
                }
            };

            reader.onerror = (error) => {
                if (isMountedRef.current) {
                    console.error("Error reading file:", error);
                    alert("There was an error reading the selected file.");
                }
            };

            reader.readAsDataURL(file);
        }
        if (fileInput) {
            fileInput.value = '';
        }
    };


    // --- Handle Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const editor = quillRef.current?.getEditor();
        const textContent = editor ? editor.getText().trim() : '';
        const htmlContent = editor ? editor.root.innerHTML : content;

        if (formType === 'thread' && !title.trim()) {
            setError("Thread title cannot be empty.");
            return;
        }
        if (!textContent && !htmlContent.includes('<img')) {
            const message = formType === 'thread' ? "Thread content" : "Reply content";
            setError(`${message} cannot be empty.`);
            return;
        }

        setIsSubmitting(true);
        let finalContent = htmlContent; // Use HTML content from editor

        try {
            const base64ImageRegex = /<img src="(data:image\/[^;]+;base64,[^"]+)"/g;
            const imagesToUpload = new Map();
            let match;

            while ((match = base64ImageRegex.exec(finalContent)) !== null) {
                const base64Src = match[1];
                if (pendingFiles.has(base64Src) && !imagesToUpload.has(base64Src)) {
                    imagesToUpload.set(base64Src, pendingFiles.get(base64Src));
                    console.log(`Found image to upload: ${base64Src}`);
                }
            }

            if (imagesToUpload.size > 0) {
                console.log(`Found ${imagesToUpload.size} unique images to upload.`);
                const uploadPromises = [];
                const uploadedUrls = new Map();
                for (const [base64Src, file] of imagesToUpload.entries()) {
                    uploadPromises.push(
                        uploadFile(file)
                            .then(cloudUrl => uploadedUrls.set(base64Src, cloudUrl))
                            .catch(uploadError => {
                                console.error(`Failed to upload image: ${file.name}`, uploadError);
                                throw new Error(`Failed to upload image: ${file.name}. ${uploadError.message}`);
                            })
                    );
                }
                await Promise.all(uploadPromises);

                finalContent = finalContent.replace(base64ImageRegex, (fullMatch, base64Src) => {
                    return uploadedUrls.has(base64Src) ? `<img src="${uploadedUrls.get(base64Src)}"` : fullMatch;
                });
            }


            // --- API Call based on formType ---
            let response;
            let payload = { content: finalContent, userId: user.id, creationDate: new Date().toISOString() }; // Assuming user.id is available
            let endpoint = '';

            if (formType === 'thread') {
                payload.title = title.trim();
                payload.topicId = parentId; // Pass topicId for thread creation
                endpoint = 'http://localhost:8080/api/thread'; // Endpoint for creating a thread
                console.log("Submitting new thread:", payload);
            } else { // 'reply'
                payload = { ...payload, threadId: threadId }; // Use threadId for reply creation
                endpoint = 'http://localhost:8080/api/reply'; // Endpoint for creating a reply
                console.log("Submitting reply:", payload);
            }

            if (isRedacting) {
                console.log('is reacting' + isRedacting)
                payload.id = isThread ? threadContent.id : redactedPost.id;
                payload.tittle = isThread ? title : '';
                console.log("new tittle " + payload.tittle);
                response = await axios.put(endpoint, payload, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
                console.log("endpoint : " + endpoint)
            } else {
                response = await axios.post(endpoint, payload, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
                console.log("twice")

                console.log(response.data)
                addReply(response.data);
            }
            console.log(`${formType === 'thread' ? 'Thread' : 'Reply'} posted successfully!`, response.data);

            setTitle('');
            setContent('');
            if (editor) editor.setText('');
            setPendingFiles(new Map());
            setError(null);
            if (onSuccess) {
                console.log(response.data)
                onSuccess(response.data); // Pass created data back if needed
            }
        } catch (submitError) {
            console.error(`Failed to submit ${formType}:`, submitError);
            const errorMsg = submitError.response?.data?.message || submitError.message || "An unexpected error occurred.";
            setError(errorMsg);
        } finally {
            if (isMountedRef.current) {
                setIsSubmitting(false);
            }
        }
    }
    const formTitle = formType === 'thread' ? "Create New Thread" : "Post a Reply";
    const submitButtonText = formType === 'thread' ? (isSubmitting ? 'Creating...' : 'Create Thread') : (isSubmitting ? 'Posting...' : 'Post Reply');


    return (
        <div className={formStyles.postFormContainer}> {/* Example class */}
            <h3 className={formStyles.postFormTitle}>{formTitle}</h3>
            {error && <div className={formStyles.errorMessage}>{error}</div>}
            <form onSubmit={handleSubmit}>
                {formType === 'thread' && isRedacting && (
                    <div className={formStyles.formGroup}>
                        <label htmlFor="threadTitle" className={formStyles.label}>Title</label>
                        <input
                            type="text"
                            id="threadTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter thread title"
                            required
                            maxLength={100}
                            className={formStyles.titleInput}
                            disabled={isSubmitting}
                        />
                    </div>
                )}

                <div className={formStyles.quillContainer}>
                    <label className={formStyles.label}>Content</label>
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        placeholder={formType === 'thread' ? "Write the main post for your thread..." : "Write your reply here..."}
                        className={formStyles.replyQuillEditor}
                    />
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    style={{ display: 'none' }}
                    disabled={isSubmitting}
                />

                <div className={formStyles.submitRow}>
                    {onCancel && (
                        <button
                            type="button"
                            className={`${formStyles.cancelBtn} ${formStyles.secondaryBtn}`}
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    )}
                    <button type="submit" className={formStyles.submitBtn} disabled={isSubmitting}>
                        {submitButtonText}
                    </button>
                </div>
            </form>
        </div>
    );
}