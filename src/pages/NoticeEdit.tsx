import React, { useRef, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import styled from 'styled-components';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../AxiosInstance';

type NoticeArticle = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  imgs?: string[];
};

const Container = styled.div`
  margin: 0 auto;
  margin: 40px 15%;
  font-family: 'sans-serif';
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 40px;
`;

const FormGroup = styled.div`
  margin-bottom: 32px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  font-size: 15px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;

  &:focus {
    outline: none;
    border-color: #d1d5db;
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 12px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;

const Button = styled.button<{ active?: boolean }>`
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 500;
  background: ${({ active }) => (active ? '#2563eb' : '#ffffff')};
  color: ${({ active }) => (active ? '#ffffff' : '#374151')};
  border: 1px solid ${({ active }) => (active ? '#2563eb' : '#d1d5db')};
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: ${({ active }) => (active ? '#1d4ed8' : '#f3f4f6')};
  }
`;

const EditorBox = styled.div`
  border: 1px solid #e5e7eb;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  background: #fff;
  padding: 16px;
  height: 400px;
  overflow-y: auto;
`;

const StyledEditorContent = styled(EditorContent)`
  width: 100%;
  height: 100%;
  .ProseMirror {
    min-height: 300px;
    outline: none;
    padding: 8px 0;
    line-height: 1.6;
    font-size: 16px;
  }
  img {
    max-width: 100%;
    border-radius: 6px;
    margin: 10px 0;
  }
`;

const SubmitButton = styled.button`
  margin-top: 40px;
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }

  &:active {
    transform: scale(0.98);
  }
`;

function generateEditorContentWithImages(article?: NoticeArticle): string {
  if (!article) return '<p></p>';
  const content = article.content || '<p></p>';
  const imagesHtml = (article.imgs || [])
    .map((src) => `<img src="${src}" />`)
    .join('');
  return `${content}${imagesHtml}`;
}

const NoticeEdit: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const article = location.state?.article as NoticeArticle | undefined;

  const [title, setTitle] = useState(article?.title || '');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Underline,
      Strike,
      Blockquote,
      HorizontalRule,
    ],
    content: generateEditorContentWithImages(article),
  });

  useEffect(() => {
    if (!article) {
      alert('게시글 정보를 불러오지 못했습니다.');
      navigate('/notice');
    }
  }, [article, navigate]);

  const insertImage = (file: File) => {
    const fileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      editor?.commands.insertContent(`<img src="${api.defaults.baseURL}img/${reader.result}" data-filename="${fileName}" />`);
      setUploadedImages((prev) => [...prev, file]);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) insertImage(file);
  };

  const handleSave = async () => {
    if (!editor) return;

    const rawContent = editor.getHTML();
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawContent, 'text/html');
    const imgTags = doc.querySelectorAll('img');

    imgTags.forEach((img, index) => {
      const filename = img.getAttribute('data-filename') || `image-${index}.png`;
      img.setAttribute('src', '');
      img.removeAttribute('data-filename');
    });

    const processedContent = doc.body.innerHTML;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', processedContent);

    uploadedImages.forEach((file) => {
      formData.append('imgs', file);
    });

    try {
      console.log('전송 폼 데이터:', formData);
      const res = await api.post(`/admin/notice/${id}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.message === 'success') {
        alert('공지사항이 성공적으로 수정되었습니다.');
        navigate(`/notice/${id}`, {
          state: { ...article, title, content: processedContent },
        });
      } else {
        alert(`수정 실패: ${res.data.message}`);
      }
    } catch (err) {
      console.error('수정 중 오류:', err);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container>
      <PageTitle>공지사항 수정</PageTitle>

      <FormGroup>
        <Label htmlFor="title">제목</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormGroup>

      <FormGroup>
        <Label>본문 내용</Label>
        <Toolbar>
          <Button onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')}><i className="bi bi-type-bold"></i></Button>
          <Button onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')}><i className="bi bi-type-italic"></i></Button>
          <Button onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive('underline')}><i className="bi bi-type-underline"></i></Button>
          <Button onClick={() => editor?.chain().focus().toggleStrike().run()} active={editor?.isActive('strike')}><i className="bi bi-type-strikethrough"></i></Button>
          <Button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive('heading', { level: 1 })}>H1</Button>
          <Button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })}>H2</Button>
          <Button onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })}>H3</Button>
          <Button onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')}>List</Button>
          <Button onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')}>Quote</Button>
          <Button onClick={() => editor?.chain().focus().toggleCodeBlock().run()} active={editor?.isActive('codeBlock')}>Code</Button>
          <Button onClick={() => editor?.chain().focus().setHorizontalRule().run()}>구분선</Button>
          <Button onClick={handleImageUpload}>🖼 이미지 삽입</Button>
          <Button onClick={() => editor?.chain().focus().undo().run()}>↺</Button>
          <Button onClick={() => editor?.chain().focus().redo().run()}>↻</Button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </Toolbar>

        <EditorBox>
          <StyledEditorContent editor={editor} />
        </EditorBox>
      </FormGroup>

      <SubmitButton onClick={handleSave}>수정 완료</SubmitButton>
    </Container>
  );
};

export default NoticeEdit;
