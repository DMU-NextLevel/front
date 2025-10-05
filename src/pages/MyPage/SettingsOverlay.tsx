import React, { ChangeEvent } from 'react'
import Swal from 'sweetalert2'

interface Props {
	userInfo: any
	tempUserInfo: any
	profileImage: string | null
	tempProfileImage: string | null
	editFields: { [key: string]: boolean }
	homePhone: { area: string; number: string }
	setHomePhone: React.Dispatch<React.SetStateAction<{ area: string; number: string }>> // ✅ 추가
	onClose: () => void
	onReset: () => void
	onInputChange: (e: ChangeEvent<HTMLInputElement>, field: string) => void
	onHomePhoneChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
	onEditClick: (field: string) => void
	onImageChange: (e: ChangeEvent<HTMLInputElement>) => void
	setEditFields: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
	setUserInfo: React.Dispatch<React.SetStateAction<any>>
	setTempUserInfo: React.Dispatch<React.SetStateAction<any>>
	setProfileImage: React.Dispatch<React.SetStateAction<string | null>>
	setTempProfileImage: React.Dispatch<React.SetStateAction<string | null>>
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
		<div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[520px] max-w-[90vw] h-auto max-h-[90vh] overflow-y-auto bg-white p-6 rounded-3xl shadow-2xl'>
			<div className='flex justify-between items-center mb-5'>
				<h2 className='text-2xl font-bold'>내 정보 설정</h2>
				<button className='text-2xl border-none bg-transparent cursor-pointer' onClick={onClose}>
					×
				</button>
			</div>

			<div className='flex-1 overflow-y-auto pr-1.5'>
				<div style={{ textAlign: 'center', marginBottom: '24px' }}>
					<label className='inline-block'>
						<img
							src={tempProfileImage || profileImage || 'https://via.placeholder.com/100'}
							alt='프로필'
							className='w-[105px] h-[105px] rounded-full object-cover pointer-events-none'
						/>
					</label>
					<input id='profile-upload-settings' type='file' accept='image/*' onChange={onImageChange} className='hidden' />
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<label
							htmlFor='profile-upload-settings'
							className='py-1.5 px-4 rounded-3xl border border-gray-300 bg-white text-xs cursor-pointer hover:bg-gray-50'
							style={{ marginTop: '10px' }}>
							이미지변경
						</label>
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
					<div key={field} className='flex items-center py-4 border-b border-gray-200 last:border-b-0'>
						<div className='w-45 font-bold text-sm text-gray-800'>
							{label}
							{['이름', '닉네임', '전화번호', '이메일 주소'].includes(label) && <span className='text-purple-500 text-base ml-1'> *</span>}
						</div>
						<div className='flex-1 text-sm text-gray-500'>
							{editFields[field] ? (
								<input
									type='text'
									value={tempUserInfo[field]}
									onChange={(e) => onInputChange(e, field)}
									className='w-full py-1.5 px-2.5 text-sm border border-gray-300 rounded-md'
								/>
							) : (
								tempUserInfo[field]
							)}
						</div>
						{editFields[field] ? (
							<button
								className='py-1.5 px-4 rounded-3xl border border-gray-300 bg-white text-xs cursor-pointer hover:bg-gray-50'
								onClick={() => {
									setEditFields((prev) => ({ ...prev, [field]: false }))
								}}>
								변경완료
							</button>
						) : (
							<button className='py-1.5 px-4 rounded-3xl border border-gray-300 bg-white text-xs cursor-pointer hover:bg-gray-50' onClick={() => onEditClick(field)}>
								변경
							</button>
						)}
					</div>
				))}

				<div className='flex items-center py-4 border-b border-gray-200 last:border-b-0'>
					<div className='w-45 font-bold text-sm text-gray-800'>집전화번호</div>
					<div className='flex gap-2'>
						<select className='py-1.5 px-2.5 rounded-md border border-gray-300 text-sm' name='area' value={homePhone.area} onChange={onHomePhoneChange}>
							<option value='02'>02 (서울)</option>
							<option value='031'>031 (경기)</option>
							<option value='032'>032 (인천)</option>
							<option value='033'>033 (강원)</option>
							<option value='041'>041 (충남)</option>
							<option value='042'>042 (대전)</option>
							<option value='043'>043 (충북)</option>
							<option value='044'>044 (세종)</option>
							<option value='051'>051 (부산)</option>
							<option value='052'>052 (울산)</option>
							<option value='053'>053 (대구)</option>
							<option value='054'>054 (경북)</option>
							<option value='055'>055 (경남)</option>
							<option value='061'>061 (전남)</option>
							<option value='062'>062 (광주)</option>
							<option value='063'>063 (전북)</option>
							<option value='064'>064 (제주)</option>
						</select>
						<input
							className='flex-1 py-1.5 px-2.5 rounded-md border border-gray-300 text-sm'
							name='number'
							type='text'
							maxLength={8}
							placeholder='전화번호를 입력해주세요.'
							value={homePhone.number}
							onChange={onHomePhoneChange}
						/>
					</div>
				</div>
			</div>

			<div className='flex justify-end gap-2.5 mt-5 pt-5 border-t border-gray-200'>
				<button className='py-1.5 px-4 rounded-3xl border border-gray-300 bg-white text-xs cursor-pointer hover:bg-gray-50' onClick={onReset}>
					초기화
				</button>

				<button
					className='py-1.5 px-4 rounded-3xl border border-gray-300 bg-white text-xs cursor-pointer hover:bg-gray-50'
					onClick={async () => {
						const { name, nickname, phone, email } = tempUserInfo

						if (!name.trim() || !nickname.trim() || !phone.trim() || !email.trim()) {
							await Swal.fire({
								icon: 'error',
								title: '필수 항목을 입력해주세요.',
								text: '이름, 닉네임, 전화번호, 이메일은 필수입니다.',
								confirmButtonColor: '#a66cff',
							})
							return
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
						})

						if (result.isConfirmed) {
							setUserInfo(tempUserInfo) // ✅ 변경 적용
							setProfileImage(tempProfileImage) // ✅ 프로필 반영

							await Swal.fire({
								icon: 'success',
								title: '정보가 변경되었습니다!',
								showConfirmButton: false,
								timer: 1500,
							})

							onClose()
						}
					}}>
					완료
				</button>
			</div>
		</div>
	)
}

export default SettingsOverlay
