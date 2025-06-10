import React, { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import styled from 'styled-components';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { useUserRole } from '../hooks/useUserRole';
import { api } from '../AxiosInstance';
import axios from 'axios';

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
  margin-bottom: 0px;
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
  transition: all 0.2s ease;

  box-shadow: ${({ active }) =>
    active ? '0 2px 6px rgba(37, 99, 235, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.05)'};

  &:hover {
    background: ${({ active }) => (active ? '#1d4ed8' : '#f3f4f6')};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
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

  /* 고정 높이 + 내부 스크롤 */
  height: 400px;
  overflow-y: auto;
`;



const StyledEditorContent = styled(EditorContent)`
  width: 100%;
  height: 100%;

  .ProseMirror {
    min-height: 300px;
    outline: none;
    box-shadow: none;
    padding: 8px 0;
    line-height: 1.6;
    font-size: 16px;
    width: 100%;
  }

  .ProseMirror:focus {
    outline: none;
    box-shadow: none;
  }

  p, h2 {
    margin: 0;
    padding: 0;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    margin: 10px 0;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  img:hover {
    opacity: 0.8;
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

const NoticeWrite: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const { role, loading } = useUserRole();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Underline,
      Strike,
      Blockquote,
      HorizontalRule,
    ],
    content: '<p></p>',
  });


  const insertImage = (file: File) => {
    const fileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      // 1. base64 삽입 → 에디터에서는 시각적 확인
      editor?.commands.insertContent(`<img src="${reader.result}" data-filename="${fileName}" />`);
      
      // 2. 파일 저장
      setUploadedImages(prev => [...prev, file]);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      insertImage(file);
    }
  };

  const extractImagesFromContent = (html: string): { base64: string, fileName: string }[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgTags = doc.querySelectorAll('img');
    
    const images = Array.from(imgTags).map(img => ({
      base64: img.getAttribute('src') || '',
      fileName: img.getAttribute('data-filename') || '',
    }));
    
    return images;
  };
  
  

  const handleSave = async () => {
    const title = (document.getElementById('title') as HTMLInputElement)?.value;
    const rawContent = editor?.getHTML();
  
    if (!title || !rawContent) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
  
    if (role !== 'ADMIN' && !loading) {
      alert('관리자만 공지사항을 작성할 수 있습니다.');
      return;
    }
  
    // DOMParser를 사용해서 이미지 src를 fileName으로 변환
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawContent, 'text/html');
    const imgTags = doc.querySelectorAll('img');
  
    imgTags.forEach(img => {
      const filename = img.getAttribute('data-filename');
      if (filename) {
        img.setAttribute('src', filename); // base64 → 파일명
        img.removeAttribute('data-filename'); // 불필요한 속성 제거
      }
    });
  
    const finalContent = doc.body.innerHTML;
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', finalContent); // 🧨 base64 제거된 최종 HTML
  
    uploadedImages.forEach(file => {
      formData.append('imgs', file);
    });
  
    try {
      const res = await axios.post('http://localhost:8080/admin/notice', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
  
      if (res.data.message === 'success') {
        alert('공지사항이 성공적으로 등록되었습니다!');
        window.location.href = '/notice';
      } else {
        alert(`등록 실패: ${res.data.message}`);
      }
    } catch (err) {
      console.error('공지사항 등록 중 오류:', err);
      alert('공지사항 등록 중 오류가 발생했습니다.');
    }
  };
  
  

 

  return (
    <Container>
      <PageTitle>공지사항 작성</PageTitle>

      <FormGroup>
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          placeholder="공지 제목을 입력하세요"
        />
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

      <SubmitButton onClick={handleSave}>공지사항 저장</SubmitButton>
    </Container>
  );
};

export default NoticeWrite;
