import React, { useState, useEffect, useRef, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import formStyles from './styles/reply_form.module.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useThread } from '../context/ThreadContext.jsx';
import { is } from 'date-fns/locale';
import { add } from 'date-fns';
import ImageResize from 'quill-image-resize-module-react';

// 2. Register it with Quill's core
Quill.register('modules/imageResize', ImageResize);
const modules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'align': ['', 'center', 'right', 'justify'] }],
        ['link', 'image'],
    ],
    imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
        displayStyles: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            color: 'white',
        }
    }
};

const formats = [
    'bold', 'italic', 'underline',
    'align',
    'link', 'image', 'width', 'height', 'style'

];

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

async function deleteImageFromServer(imageUrl) {
    try {
        const filename = imageUrl;
        if (!filename) {
            return;
        }
        const response = await axios.delete(`http://localhost:8080/api/img?url=${filename}`, {
            withCredentials: true,
        });
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            const errorMsg = response.data?.message || `Image deletion failed for ${imageUrl} with status: ${response.status}`;
        }
    } catch (error) {
        console.error(`Axios error during image deletion for ${imageUrl}:`, error);
    }
}
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('imageFile', file);
    try {
        const response = await axios.post('http://localhost:8080/api/img', formData, {
            withCredentials: true,
        });
        if (response.status >= 200 && response.status < 300 && response.data?.imageUrl) {
            return response.data.imageUrl;
        } else {
            const errorMsg = response.data?.message || `Image upload failed with status: ${response.status}`;
            console.error("Upload Response Error:", response);
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error("Axios Upload Error:", error);
        throw new Error(error.message || 'Image upload failed');
    }
}


export default function ReplyForm({ formType = 'reply', parentId, onSuccess, onCancel, threadId, redactedPost, isThread, addReply, addNews }) {
    const threadContext = useThread();
    const threadContent = threadContext?.content;
    const getInitialTitle = () => {
        if (isThread) {
            return threadContent?.id ? (threadContent.tittle || '') : '';
        } else if (formType === 'news') {
            return redactedPost?.id ? (redactedPost.title || '') : '';
        }
        return '';
    };

    const getInitialContent = () => {
        if (isThread) {
            return threadContent?.id ? (threadContent.content || '') : '';
        }
        return redactedPost?.id ? (redactedPost.content || '') : '';
    };
    const getInitialDescription = () => {
        if (formType === 'news') {
            return redactedPost?.id ? (redactedPost.description || '') : '';
        }
    }
    const [title, setTitle] = useState(getInitialTitle());
    const [content, setContent] = useState(getInitialContent());
    const [description, setDescription] = useState(getInitialDescription());
    const [pendingFiles, setPendingFiles] = useState(new Map());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { user, showBanInfo, setShowBanInfo, setBanDetails } = useAuth();
    const isMountedRef = useRef(true);
    const quillRef = useRef(null);
    const fileInputRef = useRef(null);
    const FIXED_IMAGE_WIDTH = '300';

    const isRedacting = redactedPost != null;

    const isActuallyEditing = useMemo(() => {
        if (isThread && threadContent?.id) return true;
        if (!isThread && redactedPost?.id) return true;
        return false;
    }, [isThread, threadContent, redactedPost]);


    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

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
    const handleFileInputChange = (event) => {
        const fileInput = event.target;
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];

            if (file.size > MAX_FILE_SIZE_BYTES) {
                alert(`File size exceeds limit of ${MAX_FILE_SIZE_MB}MB.`);
                fileInput.value = ''; return;
            }
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert(`Invalid file type. Only PNG, JPEG, JPG, WEBP allowed.`);
                fileInput.value = ''; return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                if (!isMountedRef.current || !quillRef.current || !e.target || typeof e.target.result !== 'string') return;

                const quill = quillRef.current.getEditor();
                const range = quill.getSelection(true);
                const base64ImageData = e.target.result;

                if (!base64ImageData.startsWith('data:image/')) {
                    console.error("FileReader result not valid data URL");
                    alert("Error processing image data."); return;
                }

                try {
                    setPendingFiles(prevMap => new Map(prevMap).set(base64ImageData, file));

                    quill.insertEmbed(range.index, 'image', base64ImageData);


                    quill.setSelection(range.index + 1, 0);
                    quill.focus();


                } catch (mapError) {
                    console.error("Error updating pendingFiles map:", mapError);
                    alert("Internal error preparing image.");
                }
            };

            reader.onerror = (err) => {
                if (isMountedRef.current) {
                    console.error("Error reading file:", err);
                    alert("Error reading selected file.");
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const editor = quillRef.current?.getEditor();
        const textContent = editor ? editor.getText().trim() : '';
        const currentRawHtmlContent = editor ? editor.root.innerHTML : content;

        if (formType === 'thread' && !title.trim()) {
            setError("Назва посту не може бути порожньою."); return;
        }
        if (!textContent && !currentRawHtmlContent.includes('<img')) {
            setError(`${formType === 'thread' ? "Пост" : "Відповідь"} вміст не можу бути порожнім.`); return;
        }

        setIsSubmitting(true);
        let finalSubmitContent = currentRawHtmlContent;

        let originalPersistedImageUrls = new Set();
        if (isActuallyEditing) {
            const originalHtml = isThread ? threadContent?.content : redactedPost?.content;
            if (originalHtml) {
                const imgTagRegex = /<img src="([^"]+)"/g;
                let match;
                while ((match = imgTagRegex.exec(originalHtml)) !== null) {
                    const src = match[1];
                    if (!src.startsWith('data:image/')) {
                        originalPersistedImageUrls.add(src);
                    }
                }
            }
        }

        try {
            const base64ImageRegex = /<img src="(data:image\/[^;]+;base64,[^"]+)"/g;
            const imagesToUpload = new Map();

            let tempContentForScan = finalSubmitContent;
            let uploadMatch;
            while ((uploadMatch = base64ImageRegex.exec(tempContentForScan)) !== null) {
                const base64Src = uploadMatch[1];
                if (pendingFiles.has(base64Src)) {
                    imagesToUpload.set(base64Src, pendingFiles.get(base64Src));
                }
            }

            if (imagesToUpload.size > 0) {
                console.log(`Uploading ${imagesToUpload.size} new images.`);
                const uploadPromises = [];
                const uploadedUrlMap = new Map();

                for (const [base64Src, file] of imagesToUpload.entries()) {
                    uploadPromises.push(
                        uploadFile(file)
                            .then(cloudUrl => {
                                if (!cloudUrl) throw new Error(`Upload for ${file.name} did not return a URL.`);
                                uploadedUrlMap.set(base64Src, cloudUrl);
                            })
                            .catch(uploadError => {
                                throw new Error(`Image upload failed for ${file.name}: ${uploadError.message}`);
                            })
                    );
                }
                await Promise.all(uploadPromises);

                finalSubmitContent = finalSubmitContent.replace(base64ImageRegex, (fullMatch, base64Src) => {
                    if (uploadedUrlMap.has(base64Src)) {
                        return `<img src="${uploadedUrlMap.get(base64Src)}"`;
                    }
                    return fullMatch;
                });
            }

            if (isActuallyEditing && originalPersistedImageUrls.size > 0) {
                const currentPersistedImageUrlsInEditor = new Set();
                const imgTagRegex = /<img src="([^"]+)"/g;
                let currentContentMatch;
                while ((currentContentMatch = imgTagRegex.exec(finalSubmitContent)) !== null) {
                    const src = currentContentMatch[1];
                    if (!src.startsWith('data:image/')) {
                        currentPersistedImageUrlsInEditor.add(src);
                    }
                }

                const urlsToDelete = [];
                for (const originalUrl of originalPersistedImageUrls) {
                    if (!currentPersistedImageUrlsInEditor.has(originalUrl)) {
                        urlsToDelete.push(originalUrl);
                    }
                }

                if (urlsToDelete.length > 0) {
                    console.log("Requesting deletion for images:", urlsToDelete);
                    const deletePromises = urlsToDelete.map(url =>
                        deleteImageFromServer(url)
                            .catch(err => console.error(`Deletion failed for ${url} (ignored):`, err.message))
                    );
                    await Promise.all(deletePromises);
                }
            }

            let response;
            let payload = {
                content: finalSubmitContent,
                userId: user.id,
                creationDate: new Date().toISOString()
            };
            let endpoint = '';

            if (formType === 'thread') {
                payload.title = title.trim();
                payload.topicId = parentId;
                endpoint = 'http://localhost:8080/api/thread';
            } else if (formType === 'news') {
                payload.description = description.trim();
                payload.title = title.trim();
                endpoint = 'http://localhost:8080/api/news';
            }
            else { // 'reply'
                payload.threadId = threadId;
                endpoint = 'http://localhost:8080/api/reply';
                delete payload.title;
            }

            if (isRedacting) {
                if (isThread && threadContent?.id) {
                    payload.id = threadContent.id;
                } else if (!isThread && redactedPost?.id) {
                    payload.id = redactedPost.id;
                }


                response = await axios.put(endpoint, payload, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            } else {
                response = await axios.post(endpoint, payload, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
                if (addReply) addReply(response.data); // User's call
                if (addNews) addNews(payload, response.data);
            }


            setTitle(getInitialTitle());
            setContent(isActuallyEditing ? getInitialContent() : '');

            setPendingFiles(new Map());
            setError(null);
            if (onSuccess && !addNews) {
                onSuccess(response.data);
                onCancel?.();
            }

        } catch (submitError) {
            console.log(submitError);
            if (submitError.response.data.errorCode === "USER_BANNED") {
                console.log("test")
                setBanDetails(submitError.response.data);
                setShowBanInfo(true);
                return
            }
            const errorMsg = submitError.response?.data?.message || submitError.message || "An unexpected error occurred.";
            setError(errorMsg);
        } finally {
            if (isMountedRef.current) {
                setIsSubmitting(false);
            }
        }
    };
    let formTitle = formType === 'thread' ? "Створити новий пост" : "Відповісти на пост";
    formTitle = formType === 'news' ? "Створити новину" : formTitle;
    formTitle = isActuallyEditing ? "Редагувати" : formTitle;
    let submitButtonText = isSubmitting ? 'Створюється...' : 'Створити'
    submitButtonText = isActuallyEditing ? 'Зберегти' : submitButtonText;

    return (
        <div className={formStyles.postFormContainer}>
            <h3 className={formStyles.postFormTitle}>{formTitle}</h3>
            {error && <div className={formStyles.errorMessage}>{error}</div>}
            <form onSubmit={handleSubmit}>
                {(formType === 'thread' || formType === 'news') && (
                    <div className={formStyles.formGroup}>
                        <label htmlFor="threadTitle" className={formStyles.label}>Заголовок</label>
                        <input
                            type="text"
                            id="threadTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Введіть заголовок"
                            required
                            maxLength={100}
                            className={formStyles.titleInput}
                            disabled={isSubmitting}
                        />
                    </div>
                )}
                {formType === 'news' && (
                    <div className={formStyles.formGroup}>
                        <label htmlFor="description" className={formStyles.label}>Опис (для попереднього перегляду)</label>
                        <textarea
                            className={formStyles.descriptionTextarea}
                            id="description"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                                if (error && e.target.value.trim()) setError("");
                            }}
                            rows="3"
                            required
                            maxLength={300}
                            placeholder="Введіть короткий опис або зведення"
                            disabled={isSubmitting}
                        />
                    </div>
                )}
                <div className={formStyles.quillContainer}>
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
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
                            Скасувати
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