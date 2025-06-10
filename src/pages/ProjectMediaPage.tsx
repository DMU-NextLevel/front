import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useCreateStore } from '../store/store';

// css 스타토토
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: #f5f7fa;
  min-height: 100vh;
  box-sizing: border-box;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 2rem 0;
  text-align: center;
  position: relative;
  padding-bottom: 1rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background-color: #a66bff;
    border-radius: 2px;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::after {
    content: '*';
    color: #a66bff;
    margin-left: 0.25rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s;

  &:focus {
    border-color: #a66bff;
    box-shadow: 0 0 0 2px rgba(166, 107, 255, 0.2);
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 0.75rem 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: none;
  transition: all 0.3s;

  &:focus {
    border-color: #a66bff;
    box-shadow: 0 0 0 2px rgba(166, 107, 255, 0.2);
    outline: none;
  }
`;

const ImageUploadArea = styled.div`
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1rem;

  &:hover {
    border-color: #a66bff;
  }
`;

const ImagePreview = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Thumbnail = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 10px;
  margin-bottom: 10px;

  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 2px;
    right: 2px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    padding: 0;

    &:hover {
      background: #ff4d4f;
    }
  }

  &::before {
    content: attr(data-index);
    position: absolute;
    top: 2px;
    left: 2px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    z-index: 1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
`;

const BackButton = styled(Button)`
  background: #f5f5f5;
  color: #666;

  &:hover {
    background: #e8e8e8;
  }
`;

const NextButton = styled(Button)`
  background: #a66bff;
  color: white;

  &:hover {
    background: #8a5cff;
  }

  &:disabled {
    background: #e0e0e0;
    cursor: not-allowed;
  }
`;

const ProjectMediaPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const {setContent, setTitleImg, setImgs} = useCreateStore()

  // ProjectInfoPage에서 전달된 데이터가 없으면 이전 페이지로 이동
  useEffect(() => {
    if (!state) {
      navigate('/project/create');
    }
  }, [navigate, state]);

  useEffect(() => {
    setTitleImg(null)
    setImgs([])
  },[])

  const MAX_IMAGES = 10;
  const MAX_VIDEOS = 3;

  const [formData, setFormData] = useState({
    thumbnail: null as File | null,
    thumbnailPreview: state?.thumbnailPreview || '',
    images: [] as { file: File; preview: string }[],
    videos: [] as { file: File; preview: string }[],
    summary: '',
    story: ''
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 검사 (1MB 이하)
      if (file.size > 1 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: '파일 크기 초과',
          text: '대표 이미지는 1MB 이하의 파일만 업로드 가능합니다.',
          confirmButtonColor: '#a66bff',
          confirmButtonText: '확인'
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          thumbnail: file,
          thumbnailPreview: reader.result as string
        }));
      };
      setTitleImg(file)
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = MAX_IMAGES - formData.images.length;
      if (remainingSlots <= 0) {
        Swal.fire({
          icon: 'error',
          title: '업로드 제한',
          text: `이미지는 최대 ${MAX_IMAGES}개까지 업로드 가능합니다.`,
          confirmButtonColor: '#a66bff',
          confirmButtonText: '확인'
        });
        return;
      }

      const validFiles = Array.from(files).slice(0, remainingSlots);

      // 파일 크기 검사 (각 파일 1MB 이하)
      const oversizedFiles = validFiles.filter(file => file.size > 1 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        Swal.fire({
          icon: 'error',
          title: '파일 크기 초과',
          text: '이미지 파일은 1MB 이하여야 합니다.',
          confirmButtonColor: '#a66bff',
          confirmButtonText: '확인'
        });
        return;
      }

      const newImages = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, MAX_IMAGES)
      }));

      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      const currentImgs = useCreateStore.getState().imgs
      setImgs([...currentImgs, ...validFiles])
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = MAX_VIDEOS - formData.videos.length;
      if (remainingSlots <= 0) {
        Swal.fire({
          icon: 'error',
          title: '업로드 제한',
          text: `동영상은 최대 ${MAX_VIDEOS}개까지 업로드 가능합니다.`,
          confirmButtonColor: '#a66bff',
          confirmButtonText: '확인'
        });
        return;
      }

      const validFiles = Array.from(files).slice(0, remainingSlots);

      // 파일 형식 및 크기 검사
      const invalidFiles = validFiles.filter(file => {
        const fileName = file.name.toLowerCase();
        const isValidFormat = fileName.endsWith('.mp4') || fileName.endsWith('.webm') ||
                           file.type === 'video/mp4' || file.type === 'video/webm';
        const isSizeValid = file.size <= 1 * 1024 * 1024; // 1MB
        return !isValidFormat || !isSizeValid;
      });

      if (invalidFiles.length > 0) {
        Swal.fire({
          icon: 'error',
          title: '파일 오류',
          text: '동영상은 MP4, WebM 형식만 가능하며, 최대 1MB까지 업로드 가능합니다.',
          confirmButtonColor: '#a66bff',
          confirmButtonText: '확인'
        });
        return;
      }

      const newVideos = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, ...newVideos].slice(0, MAX_VIDEOS)
      }));

      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIndex(index);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = Number(e.dataTransfer.getData('text/plain'));

    if (sourceIndex === targetIndex) return;

    const newImages = [...formData.images];
    const [movedItem] = newImages.splice(sourceIndex, 1);
    newImages.splice(targetIndex, 0, movedItem);

    setFormData(prev => ({
      ...prev,
      images: newImages
    }));

    e.currentTarget.style.opacity = '1';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
    setDraggedIndex(null);
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    const removed = newImages.splice(index, 1);
    URL.revokeObjectURL(removed[0].preview);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const removeVideo = (index: number) => {
    const newVideos = [...formData.videos];
    const removed = newVideos.splice(index, 1);
    URL.revokeObjectURL(removed[0].preview);
    setFormData(prev => ({
      ...prev,
      videos: newVideos
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.thumbnailPreview) {
      Swal.fire({
        icon: 'error',
        title: '대표 이미지 필요',
        text: '대표 이미지를 업로드해주세요.',
        confirmButtonColor: '#a66bff',
        confirmButtonText: '확인'
      });
      return;
    }

    if (formData.images.length === 0) {
      Swal.fire({
        icon: 'error',
        title: '이미지 필요',
        text: '최소 1개 이상의 이미지를 업로드해주세요.',
        confirmButtonColor: '#a66bff',
        confirmButtonText: '확인'
      });
      return;
    }

    if (!formData.summary.trim()) {
      Swal.fire({
        icon: 'error',
        title: '프로젝트 요약 필요',
        text: '프로젝트 요약을 작성해주세요.',
        confirmButtonColor: '#a66bff',
        confirmButtonText: '확인'
      });
      return;
    }

    if (!formData.story.trim()) {
      Swal.fire({
        icon: 'error',
        title: '프로젝트 스토리 필요',
        text: '프로젝트 스토리를 작성해주세요.',
        confirmButtonColor: '#a66bff',
        confirmButtonText: '확인'
      });
      return;
    }

    // 폼 데이터 처리 로직 (예: 서버 전송)
    console.log('프로젝트 전체 데이터:', {
      ...state, // ProjectInfoPage에서 전달된 데이터 (대표 이미지 포함)
      images: formData.images.map(f => f.file),
      videos: formData.videos.map(f => f.file),
      summary: formData.summary,
      story: formData.story
    });

    // 다음 단계(프로젝트 소개 페이지)로 이동
    navigate('/project/introduction', {
      state: {
        ...state, // ProjectInfoPage에서 전달된 데이터
        thumbnail: formData.thumbnail,
        thumbnailPreview: formData.thumbnailPreview,
        images: formData.images,
        videos: formData.videos,
        summary: formData.summary,
        story: formData.story
      }
    });
  };

  const isFormValid = () => {
    return (
      formData.thumbnailPreview !== '' && // 대표 이미지 필수
      formData.images.length > 0 &&       // 최소 1개 이상의 이미지 필수
      formData.summary.trim() !== '' &&   // 프로젝트 한줄소개 필수
      formData.story.trim() !== ''        // 프로젝트 요약 필수
    );
  };

  const scriptChange = (e:any) => {
    setFormData(prev => ({ ...prev, summary: e.target.value }))
    setContent(formData.summary)
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>프로젝트 미디어 및 스토리</Title>

        <Section>
          <SectionTitle>대표 이미지 <span style={{ color: '#ff4d4f' }}>*</span></SectionTitle>
          <SectionDescription>프로젝트를 대표하는 썸네일 이미지를 업로드해주세요.</SectionDescription>
          <ImageUploadArea
            onClick={() => fileInputRef.current?.click()}
            style={formData.thumbnailPreview ? { borderColor: '#a66bff', borderStyle: 'solid' } : {}}
          >
            {formData.thumbnailPreview ? (
              <img
                src={formData.thumbnailPreview}
                alt="대표 이미지 미리보기"
                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
              />
            ) : (
              <div>
                <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
                <p style={{ fontSize: '0.8rem', color: '#999' }}>권장 사이즈: 1200x675px (16:9 비율)</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleThumbnailChange}
              accept="image/*"
              style={{ display: 'none' }}
              required
            />
          </ImageUploadArea>
        </Section>

        <Section>
          <SectionTitle>프로젝트 이미지 <span style={{ color: '#ff4d4f' }}>*</span> <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'normal' }}>({formData.images.length}/{MAX_IMAGES})</span></SectionTitle>
          <SectionDescription>
            프로젝트를 소개할 이미지를 업로드하세요. (최대 {MAX_IMAGES}개, 각 파일 최대 1MB)
          </SectionDescription>

          <ImageUploadArea
            onClick={() => imageInputRef.current?.click()}
            style={{ marginBottom: '1rem' }}
          >
            <div>
              <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
              <p style={{ fontSize: '0.8rem', color: '#999' }}>모든 이미지 형식 (최대 1MB)</p>
              <p style={{ fontSize: '0.8rem', color: formData.images.length >= MAX_IMAGES ? '#ff4d4f' : '#999' }}>
                {`업로드 가능: ${MAX_IMAGES - formData.images.length}개`}
              </p>
            </div>
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              disabled={formData.images.length >= MAX_IMAGES}
              style={{ display: 'none' }}
            />
          </ImageUploadArea>

          {formData.images.length > 0 && (
            <>
              <p style={{ marginBottom: '0.5rem' }}>업로드된 이미지 ({formData.images.length}/{MAX_IMAGES}):</p>
              <ImagePreview>
                {formData.images.map((image, index) => (
                  <Thumbnail
                    key={`img-${index}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    data-index={index + 1}
                    style={{
                      opacity: draggedIndex === index ? 0.5 : 1,
                      cursor: 'grab',
                      transition: 'opacity 0.2s',
                      backgroundColor: draggedIndex === index ? '#f0f0f0' : 'transparent'
                    }}
                  >
                              <img
                                src={image.preview}
                                alt={`이미지 ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  pointerEvents: 'none'
                                }}
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(index);
                                }}
                                style={{ cursor: 'pointer' }}
                              >
                                ×
                              </button>
                  </Thumbnail>
                ))}
              </ImagePreview>
            </>
          )}
        </Section>

        <Section>
          <SectionTitle>프로젝트 동영상 (선택) <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'normal' }}>({formData.videos.length}/{MAX_VIDEOS})</span></SectionTitle>
          <SectionDescription>
            프로젝트를 소개할 동영상을 업로드하세요. (최대 {MAX_VIDEOS}개, 각 파일 최대 1MB)
          </SectionDescription>

          <ImageUploadArea
            onClick={() => videoInputRef.current?.click()}
            style={{ marginBottom: '1rem' }}
          >
            <div>
              <p>동영상을 드래그하거나 클릭하여 업로드하세요</p>
              <p style={{ fontSize: '0.8rem', color: '#999' }}>MP4, WebM (최대 1MB, 3분 이내)</p>
              <p style={{ fontSize: '0.8rem', color: formData.videos.length >= MAX_VIDEOS ? '#ff4d4f' : '#999' }}>
                {`업로드 가능: ${MAX_VIDEOS - formData.videos.length}개`}
              </p>
            </div>
            <input
              type="file"
              ref={videoInputRef}
              onChange={handleVideoUpload}
              accept=".mp4,.webm,video/mp4,video/webm"
              multiple
              disabled={formData.videos.length >= MAX_VIDEOS}
              style={{ display: 'none' }}
            />
          </ImageUploadArea>

          {formData.videos.length > 0 && (
            <>
              <p style={{ marginBottom: '0.5rem' }}>업로드된 동영상 ({formData.videos.length}/{MAX_VIDEOS}):</p>
              <ImagePreview>
                {formData.videos.map((video, index) => (
                  <Thumbnail key={`vid-${index}`}>
                    <video
                      src={video.preview}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeVideo(index);
                      }}
                    >
                      ×
                    </button>
                  </Thumbnail>
                ))}
              </ImagePreview>
            </>
          )}
        </Section>

        <Section>
          <SectionTitle>프로젝트 요약 <span style={{ color: '#ff4d4f' }}>*</span></SectionTitle>
          <SectionDescription>프로젝트를 한 줄로 간단하게 소개해주세요. (최대 30자)</SectionDescription>
          <Input
            type="text"
            placeholder="예: 혁신적인 기술로 일상의 문제 해결"
            maxLength={30}
            value={formData.summary}
            onChange={scriptChange}
            required
          />
        </Section>

        <Section>
          <SectionTitle>프로젝트 스토리 <span style={{ color: '#ff4d4f' }}>*</span></SectionTitle>
          <SectionDescription>
            프로젝트에 대한 자세한 설명을 작성해주세요. 다음 내용을 포함하면 좋아요:
          </SectionDescription>
          <ul style={{ margin: '0 0 1.5rem 1.5rem', color: '#666' }}>
            <li>이 프로젝트를 시작하게 된 계기</li>
            <li>이 프로젝트가 해결하고자 하는 문제</li>
            <li>이 프로젝트의 차별화 포인트</li>
            <li>기대 효과 및 향후 계획</li>
          </ul>
          <TextArea
            placeholder="프로젝트에 대한 자세한 설명을 작성해주세요."
            value={formData.story}
            onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
            required
          />
        </Section>

        <ButtonGroup>
          <BackButton type="button" onClick={() => navigate(-1)}>
            이전
          </BackButton>
          <NextButton
            type="submit"
            disabled={!isFormValid()}
            style={{ opacity: isFormValid() ? 1 : 0.6 }}
          >
            다음 단계로
          </NextButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default ProjectMediaPage;
