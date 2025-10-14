import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';

interface Props {
  userInfo: any;
  tempUserInfo: any;
  profileImage: string | null;
  tempProfileImage: string | null;
  editFields: { [key: string]: boolean };
  homePhone: { area: string; number: string };
  setHomePhone: React.Dispatch<React.SetStateAction<{ area: string; number: string }>>; // ✅ 추가
  onClose: () => void;
  onReset: () => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>, field: string) => void;
  onHomePhoneChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEditClick: (field: string) => void;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setEditFields: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
  setTempUserInfo: React.Dispatch<React.SetStateAction<any>>;
  setProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
  setTempProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const SettingsOverlay: React.FC<Props> = ({
  userInfo,
  tempUserInfo,
  profileImage,
  tempProfileImage,
  editFields,
  homePhone,
  setHomePhone, // ✅ props 추가
  onClose,
  onReset,
  onInputChange,
  onHomePhoneChange,
  onEditClick,
  onImageChange,
  setEditFields,
  setUserInfo,
  setTempUserInfo,
  setProfileImage,
  setTempProfileImage,
}) => {
  return (
    <Overlay>
      <OverlayHeader>
        <h2>내 정보 설정</h2>
        <CloseButton onClick={onClose}>×</CloseButton>
      </OverlayHeader>

      <ScrollableContent>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <ImageInputLabel>
            <AvatarImg
              src={
                tempProfileImage || profileImage ||
                'https://via.placeholder.com/100'
              }
              alt="프로필"
              style={{ width: '100px', height: '100px' }}
            />
          </ImageInputLabel>
          <HiddenFileInput
            id="profile-upload-settings"
            type="file"
            accept="image/*"
            onChange={onImageChange}
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ChangeBtn as="label" htmlFor="profile-upload-settings" style={{ marginTop: '10px' }}>
              이미지변경
            </ChangeBtn>
          </div>
        </div>

        {[
          { label: '이름', field: 'name' },
          { label: '닉네임', field: 'nickname' },
          { label: '전화번호', field: 'phone' },
          { label: '이메일 주소', field: 'email' },
          { label: '비밀번호', field: 'password' },
          { label: '비밀번호 확인', field: 'passwordcf' },
        ].map(({ label, field }) => (
          <InfoItem key={field}>
            <Label>
              {label}
              {['이름', '닉네임', '전화번호', '이메일 주소'].includes(label) && (
                <RequiredMark> *</RequiredMark>
              )}
            </Label>
            <Content>
              {editFields[field] ? (
                <input
                  type="text"
                  value={tempUserInfo[field]}
                  onChange={(e) => onInputChange(e, field)}
                />
              ) : (
                tempUserInfo[field]
              )}
            </Content>
            {editFields[field] ? (
              <ChangeBtn
                onClick={() => {
                  setEditFields((prev) => ({ ...prev, [field]: false }));
                }}
              >
                변경완료
              </ChangeBtn>
            ) : (
              <ChangeBtn onClick={() => onEditClick(field)}>변경</ChangeBtn>
            )}
          </InfoItem>
        ))}

        <InfoItem>
          <Label>집전화번호</Label>
          <FlexRow>
            <AreaSelect
              name="area"
              value={homePhone.area}
              onChange={onHomePhoneChange}
            >
              <option value="02">02 (서울)</option>
              <option value="031">031 (경기)</option>
              <option value="032">032 (인천)</option>
              <option value="033">033 (강원)</option>
              <option value="041">041 (충남)</option>
              <option value="042">042 (대전)</option>
              <option value="043">043 (충북)</option>
              <option value="044">044 (세종)</option>
              <option value="051">051 (부산)</option>
              <option value="052">052 (울산)</option>
              <option value="053">053 (대구)</option>
              <option value="054">054 (경북)</option>
              <option value="055">055 (경남)</option>
              <option value="061">061 (전남)</option>
              <option value="062">062 (광주)</option>
              <option value="063">063 (전북)</option>
              <option value="064">064 (제주)</option>
            </AreaSelect>
            <HomePhoneInput
              name="number"
              type="text"
              maxLength={8}
              placeholder="전화번호를 입력해주세요."
              value={homePhone.number}
              onChange={onHomePhoneChange}
            />
          </FlexRow>
        </InfoItem>
      </ScrollableContent>

      <OverlayFooter>
        <ChangeBtn onClick={onReset}>초기화</ChangeBtn>

        <ChangeBtn
          onClick={async () => {
            const { name, nickname, phone, email } = tempUserInfo;

            if (!name.trim() || !nickname.trim() || !phone.trim() || !email.trim()) {
              await Swal.fire({
                icon: 'error',
                title: '필수 항목을 입력해주세요.',
                text: '이름, 닉네임, 전화번호, 이메일은 필수입니다.',
                confirmButtonColor: '#a66cff',
              });
              return;
            }

            const result = await Swal.fire({
              title: '변경사항을 저장할까요?',
              text: '입력한 정보가 저장됩니다.',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: '저장',
              cancelButtonText: '취소',
              confirmButtonColor: '#A66CFF',
              cancelButtonColor: '#ddd',
            });

            if (result.isConfirmed) {
              setUserInfo(tempUserInfo); // ✅ 변경 적용
              setProfileImage(tempProfileImage); // ✅ 프로필 반영

              await Swal.fire({
                icon: 'success',
                title: '정보가 변경되었습니다!',
                showConfirmButton: false,
                timer: 1500,
              });

              onClose();
            }
          }}
        >
          완료
        </ChangeBtn>
      </OverlayFooter>
    </Overlay>
  );
};

export default SettingsOverlay;

/* ---------------------- Styled Components ---------------------- */
const Overlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 520px;
  max-width: 90vw;
  height: auto;
  max-height: 90vh;
  overflow-y: auto;
  background: #fff;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
`;

const OverlayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 24px;
    font-weight: bold;
  }
`;

const CloseButton = styled.button`
  font-size: 24px;
  border: none;
  background: none;
  cursor: pointer;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.div`
  width: 180px;
  font-weight: bold;
  font-size: 15px;
  color: #333;
`;

const Content = styled.div`
  flex: 1;
  font-size: 14px;
  color: #666;

  input {
    width: 100%;
    padding: 6px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
`;

const ChangeBtn = styled.button`
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background: white;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #f3f3f3;
  }
`;

const RequiredMark = styled.span`
  color: #a66cff;
  font-size: 16px;
  margin-left: 4px;
`;

const FlexRow = styled.div`
  display: flex;
  gap: 8px;
`;

const AreaSelect = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const HomePhoneInput = styled.input`
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImageInputLabel = styled.label`
  display: inline-block;
`;

const AvatarImg = styled.img`
  width: 105px;
  height: 105px;
  border-radius: 50%;
  object-fit: cover;
  pointer-events: none;
`;

const OverlayFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;
