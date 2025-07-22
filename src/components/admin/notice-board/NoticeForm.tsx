import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Languages, Bold, Italic, Link as LinkIcon, ListOrdered, List, Code, Heading } from 'lucide-react';
import { Notice } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useTranslation } from '../../../i18n/useTranslation';
import { formatMarkdown } from '../../../utils/markdown';

interface NoticeFormProps {
  editingNotice: Notice | null;
  onSubmit: (formData: { 
    title: { en: string; gu: string; }; 
    content: { en: string; gu: string; }; 
    images: string[]; 
    active: boolean;
    formatted_content?: { en: string; gu: string; };
  }) => Promise<void>;
  onClose: () => void;
}

export function NoticeForm({ editingNotice, onSubmit, onClose }: NoticeFormProps) {
  const { language } = useTranslation();
  const [currentLang, setCurrentLang] = useState<'en' | 'gu'>(language);
  const [form, setForm] = useState({
    title: {
      en: typeof editingNotice?.title === 'object' ? editingNotice?.title?.en || '' : editingNotice?.title || '',
      gu: typeof editingNotice?.title === 'object' ? editingNotice?.title?.gu || '' : ''
    },
    content: {
      en: typeof editingNotice?.content === 'object' ? editingNotice?.content?.en || '' : editingNotice?.content || '',
      gu: typeof editingNotice?.content === 'object' ? editingNotice?.content?.gu || '' : ''
    },
    formatted_content: {
      en: editingNotice?.formatted_content && typeof editingNotice.formatted_content === 'object' ? editingNotice.formatted_content.en || '' : '',
      gu: editingNotice?.formatted_content && typeof editingNotice.formatted_content === 'object' ? editingNotice.formatted_content.gu || '' : ''
    },
    images: editingNotice?.images || [],
    active: editingNotice?.active ?? true
  });
  const [showPreview, setShowPreview] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setUploading(true);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'ktpatel100@gmail.com',
        password: 'Krish@12'
      });

      if (signInError) throw signInError;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error } = await supabase.storage
        .from('notices')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('notices')
        .getPublicUrl(fileName);

      setForm(prev => ({
        ...prev,
        images: [...prev.images, publicUrl]
      }));

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const imageUrl = form.images[index];
      
      // Use a safer approach to check if image is from our storage
      // Extract the path from the URL structure without relying on protected properties
      const noticesStoragePattern = /\/storage\/v1\/object\/public\/notices\//;
      if (noticesStoragePattern.test(imageUrl)) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'ktpatel100@gmail.com',
          password: 'Krish@12'
        });

        if (signInError) throw signInError;

        const path = imageUrl.split('/').pop();
        if (path) {
          await supabase.storage
            .from('notices')
            .remove([path]);
        }
      }

      setForm(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const addFormatting = (tag: string) => {
    const textarea = document.getElementById(`content-${currentLang}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let newText = '';
    let cursorOffset = 0;
    
    switch (tag) {
      case 'bold':
        newText = `**${selectedText}**`;
        if (!selectedText) cursorOffset = -2;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        if (!selectedText) cursorOffset = -1;
        break;
      case 'link':
        newText = `[${selectedText}](url)`;
        if (!selectedText) cursorOffset = -1;
        break;
      case 'ul':
        newText = `\n- ${selectedText}`;
        if (!selectedText) cursorOffset = 0;
        break;
      case 'ol':
        newText = `\n1. ${selectedText}`;
        if (!selectedText) cursorOffset = 0;
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        if (!selectedText) cursorOffset = -1;
        break;
      case 'heading':
        newText = `\n## ${selectedText}`;
        if (!selectedText) cursorOffset = 0;
        break;
      default:
        return;
    }

    const newContent = text.substring(0, start) + newText + text.substring(end);
    setForm(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [currentLang]: newContent
      }
    }));

    // Set cursor position for empty selections
    if (!selectedText && cursorOffset !== 0) {
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + newText.length + cursorOffset;
      }, 0);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Modal backdrop with fixed positioning and inline styles to avoid any margins */}
      <div 
        className="fixed inset-0 z-[9999]"
        style={{ 
          margin: 0, 
          padding: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)'
        }}
        onClick={handleBackdropClick}
      >
        <div className="w-full h-full flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto relative flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
            ref={modalRef}
          >
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#2B5C4B] to-[#234539] rounded-t-xl">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {editingNotice ? 'Edit Notice' : 'Add New Notice'}
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Language Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setCurrentLang('en')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      currentLang === 'en'
                        ? 'bg-[#2B5C4B] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Languages className="h-4 w-4" />
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentLang('gu')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      currentLang === 'gu'
                        ? 'bg-[#2B5C4B] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Languages className="h-4 w-4" />
                    ગુજરાતી
                  </button>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title ({currentLang === 'en' ? 'English' : 'ગુજરાતી'})
                  </label>
                  <input
                    type="text"
                    required={currentLang === 'en'}
                    value={form.title[currentLang]}
                    onChange={(e) => setForm(prev => ({
                      ...prev,
                      title: {
                        ...prev.title,
                        [currentLang]: e.target.value
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B]"
                  />
                </div>

                {/* Content with Formatting Tools and Preview */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Content ({currentLang === 'en' ? 'English' : 'ગુજરાતી'})
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className={`text-sm px-3 py-1 rounded-md ${
                          showPreview 
                            ? 'bg-gray-200 text-gray-800' 
                            : 'bg-[#2B5C4B] text-white'
                        }`}
                      >
                        {showPreview ? 'Switch to Edit' : 'Show Preview'}
                      </button>
                    </div>
                  </div>
                  
                  {showPreview ? (
                    // Preview mode
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Preview</span>
                        <button
                          type="button"
                          onClick={() => setShowPreview(false)}
                          className="text-xs text-[#2B5C4B] hover:text-[#234539]"
                        >
                          Edit
                        </button>
                      </div>
                      <div 
                        className="prose prose-[#2B5C4B] max-w-none p-4 min-h-[200px] bg-white"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMarkdown(form.content[currentLang]) 
                        }}
                      />
                    </div>
                  ) : (
                    // Edit mode
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      {/* Formatting toolbar */}
                      <div className="flex flex-wrap items-center gap-1 px-1 py-2 sm:p-2 bg-gray-50 border-b border-gray-300">
                        <div className="flex items-center mr-2">
                          <span className="text-xs font-medium text-gray-500 mr-2">Text</span>
                          <div className="h-4 border-r border-gray-300"></div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => addFormatting('bold')}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                          title="Bold (Ctrl+B)"
                        >
                          <Bold className="h-4 w-4" />
                          <span className="text-xs font-medium hidden sm:inline">Bold</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => addFormatting('italic')}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                          title="Italic (Ctrl+I)"
                        >
                          <Italic className="h-4 w-4" />
                          <span className="text-xs font-medium hidden sm:inline">Italic</span>
                        </button>
                        
                        <div className="h-4 border-r border-gray-300 mx-1"></div>
                        
                        <div className="flex items-center mr-2">
                          <span className="text-xs font-medium text-gray-500 mr-2">Structure</span>
                          <div className="h-4 border-r border-gray-300"></div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => addFormatting('heading')}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                          title="Heading"
                        >
                          <Heading className="h-4 w-4" />
                          <span className="text-xs font-medium hidden sm:inline">Heading</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => addFormatting('ul')}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                          title="Bullet List"
                        >
                          <List className="h-4 w-4" />
                          <span className="text-xs font-medium hidden sm:inline">List</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => addFormatting('ol')}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                          title="Numbered List"
                        >
                          <ListOrdered className="h-4 w-4" />
                          <span className="text-xs font-medium hidden sm:inline">Numbers</span>
                        </button>
                        
                        <div className="h-4 border-r border-gray-300 mx-1"></div>
                        
                        <div className="flex items-center mr-2">
                          <span className="text-xs font-medium text-gray-500 mr-2">Insert</span>
                          <div className="h-4 border-r border-gray-300"></div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => addFormatting('link')}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                          title="Link"
                        >
                          <LinkIcon className="h-4 w-4" />
                          <span className="text-xs font-medium hidden sm:inline">Link</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => addFormatting('code')}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                          title="Inline Code"
                        >
                          <Code className="h-4 w-4" />
                          <span className="text-xs font-medium hidden sm:inline">Code</span>
                        </button>
                        
                        <div className="ml-auto">
                          <button
                            type="button"
                            onClick={() => setShowPreview(true)}
                            className="text-xs bg-[#2B5C4B]/10 text-[#2B5C4B] hover:bg-[#2B5C4B]/20 px-2 py-1 rounded flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            Preview
                          </button>
                        </div>
                      </div>
                      
                      {/* Editor */}
                      <div className="flex flex-col sm:flex-row">
                        <textarea
                          id={`content-${currentLang}`}
                          value={form.content[currentLang]}
                          onChange={(e) => setForm(prev => ({
                            ...prev,
                            content: {
                              ...prev.content,
                              [currentLang]: e.target.value
                            }
                          }))}
                          rows={8}
                          className="w-full px-4 py-3 focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] border-0 font-mono text-sm"
                          placeholder="Write your content here..."
                        />
                      </div>
                      
                      {/* Quick reference */}
                      <div className="bg-gray-50 px-1 py-2 sm:p-2 border-t border-gray-300">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">Markdown Quick Reference</p>
                          <button 
                            type="button"
                            onClick={() => {
                              // Add a basic markdown template if empty
                              if (!form.content[currentLang]) {
                                setForm(prev => ({
                                  ...prev,
                                  content: {
                                    ...prev.content,
                                    [currentLang]: "## My Heading\n\nThis is a paragraph with **bold** and *italic* text.\n\n- List item 1\n- List item 2\n\n[Visit our website](https://example.com)"
                                  }
                                }));
                              }
                            }}
                            className="text-xs text-[#2B5C4B] hover:underline"
                          >
                            Add Template
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <div className="bg-white border border-gray-200 text-xs text-gray-700 px-2 py-1 rounded-md">**bold**</div>
                          <div className="bg-white border border-gray-200 text-xs text-gray-700 px-2 py-1 rounded-md">*italic*</div>
                          <div className="bg-white border border-gray-200 text-xs text-gray-700 px-2 py-1 rounded-md">[link](url)</div>
                          <div className="bg-white border border-gray-200 text-xs text-gray-700 px-2 py-1 rounded-md">## heading</div>
                          <div className="bg-white border border-gray-200 text-xs text-gray-700 px-2 py-1 rounded-md">- bullet list</div>
                          <div className="bg-white border border-gray-200 text-xs text-gray-700 px-2 py-1 rounded-md">1. numbered list</div>
                          <div className="bg-white border border-gray-200 text-xs text-gray-700 px-2 py-1 rounded-md">`inline code`</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Images Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Images
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="relative px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2B5C4B] transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-center gap-2 text-gray-600">
                          <Upload className="h-5 w-5" />
                          <span className="text-sm font-medium">
                            {uploading ? 'Uploading...' : 'Upload Image'}
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Existing image display code */}
                {form.images.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2">
                    {form.images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="h-4 w-4 text-[#2B5C4B] focus:ring-[#2B5C4B] border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                      Active
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#2B5C4B] rounded-lg hover:bg-[#234539]"
                    >
                      {editingNotice ? 'Update' : 'Create'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}