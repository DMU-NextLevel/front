	import React, { useEffect, useRef, useState } from 'react'
	import styled from 'styled-components'
	import LogoImage from '../../assets/images/withuLogo.png'
	import CategoryImage from '../../assets/images/category.png'
	import SearchImage from '../../assets/images/search.svg'
	import UserImage from '../../assets/images/default_profile.png'
	import NotificationImage from '../../assets/images/bell.png'
	import { useNavigate } from 'react-router-dom'
	import { useAuth } from '../../hooks/AuthContext'


	interface HeaderBaseProps {
		isLoggedIn: boolean
		showCategoryMenu?: boolean
		onLogoClick?: () => void
		onLoginClick?: () => void
		onProfileClick?: () => void
		onProjectCreate?: () => void
		onCategoryClick?: () => void
		showSearchBar?: boolean
		showNotification?: boolean
	}

	export const HeaderMain: React.FC = () => {
		const [isOpen, setIsOpen] = useState<boolean>(false)
		const {isLoggedIn, logout} = useAuth()
		const [showNotification, setShowNotification] = useState<boolean>(false)
		const notificationRef = useRef<HTMLDivElement>(null)
		const navigate = useNavigate()
		const [isHoveringCategory, setIsHoveringCategory] = useState(false)


		const handleLogoClick = () => {
			navigate('/')
			setIsOpen(false)
		}

		const handleLoginClick = () => {
			navigate('/login')
			setIsOpen(false)
		}
		const handleSignupClick = () => {
			navigate('/signup')
			setIsOpen(false)
		}

		const handleCategoryClick = () => {
			setIsOpen(!isOpen)
		}

		const handleProjectCreate = () => {
			navigate('/project/create')
		}

		const handleProfileClick = () => {
			navigate('/mypage')
		}

		const toggleNotification = () => {
			setShowNotification((prev) => !prev)
		}

		useEffect(() => {
			const handleClickOutside = (e: MouseEvent) => {
				if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
					setShowNotification(false)
				}
			}

			if (showNotification) {
				document.addEventListener('mousedown', handleClickOutside)
			} else {
				document.removeEventListener('mousedown', handleClickOutside)
			}

			return () => {
				document.removeEventListener('mousedown', handleClickOutside)
			}
		}, [showNotification])

		return (
			<div>
				<HeaderNavbar>
				<Logo src={LogoImage} onClick={handleLogoClick} />
					<CategoryMenu onClick={handleCategoryClick}>
						
						<NavItem><Category src={CategoryImage} alt='' /> 카테고리</NavItem>
					</CategoryMenu>
					<NavItem>인기</NavItem>
					<NavItem>신규</NavItem>
					<NavItem>마감임박</NavItem>
					<ProjectButton onClick={handleProjectCreate}>프로젝트 시작하기</ProjectButton>
					<SearchBar>
						<SearchInput type='text' placeholder='검색어를 입력하세요' />
						<Search src={SearchImage} alt='' />
					</SearchBar>
					{!isLoggedIn ? (
							<div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center', gap: '0px' }}>
								<HeaderLink onClick={handleLoginClick}>로그인</HeaderLink>
								<HeaderLink onClick={handleSignupClick}>회원가입</HeaderLink>
							</div>
						) : (
							<div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center', gap: '30px' }}>
								<NotificationWrapper>
									<Notification src={NotificationImage} onClick={toggleNotification} />
									{showNotification && <NotificationBox ref={notificationRef}>새 알림이 없습니다</NotificationBox>}
								</NotificationWrapper>
								<UserProfile src={UserImage} onClick={handleProfileClick} />
							</div>
						)}
				</HeaderNavbar>
				{
					<CategoryListLayout isOpen={isOpen}>
						<CategoryList>
							<CategoryListItem><i className="bi bi-cpu"></i> 테크/가전</CategoryListItem>
							<CategoryListItem><i className="bi bi-house"></i> 라이프스타일</CategoryListItem>
							<CategoryListItem><i className="bi bi-bag"></i> 패션/잡화</CategoryListItem>
							<CategoryListItem><i className="bi bi-heart-pulse"></i> 뷰티/헬스</CategoryListItem>
							<CategoryListItem><i className="bi bi-brush"></i> 취미/DIY</CategoryListItem>
							<CategoryListItem><i className="bi bi-controller"></i> 게임</CategoryListItem>
							<CategoryListItem><i className="bi bi-book"></i> 교육/키즈</CategoryListItem>
							<CategoryListItem><i className="bi bi-star"></i> 반려동물</CategoryListItem>
							<CategoryListItem><i className="bi bi-airplane"></i> 여행/레저</CategoryListItem>
							<CategoryListItem><i className="bi bi-cup-straw"></i> 푸드/음료</CategoryListItem>
						</CategoryList>
					</CategoryListLayout>
				}
			</div>
		)
	}

	export const HeaderSub: React.FC = () => {
		const {isLoggedIn, logout} = useAuth()
		const navigate = useNavigate()

		const handleLoginClick = () => {
			navigate('/login')
		}

		const handleLogoClick = () => {
			navigate('/')
		}

		const handleProjectCreate = () => {
			navigate('/project/create')
		}

		return (
			<HeaderLayout>
				<TopHeader>
					<Logo src={LogoImage} onClick={handleLogoClick} />
					<HeaderNavbar>
						<p>인기</p>
						<p>신규</p>
						<p>마감임박</p>
					</HeaderNavbar>
					{!isLoggedIn ? (
						<HeaderLink onClick={handleLoginClick}>로그인</HeaderLink>
						//<HeaderLink onClick={handleLoginClick}>회원가입</HeaderLink>
					) : (
						<div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center', gap: '30px' }}>
							<SearchBar>
								<SearchInput type='text' placeholder='검색어를 입력하세요' />
								<Search src={SearchImage} alt='' />
							</SearchBar>
							<Notification src={NotificationImage} />
							<UserProfile src={UserImage} />
							<ProjectButton onClick={handleProjectCreate}>프로젝트 시작하기</ProjectButton>
						</div>
					)}
				</TopHeader>
			</HeaderLayout>
		)
	}

	const HeaderLayout = styled.div`
		display: flex;
		height: 60px;
		padding: 0 15%;
		margin: 5px;
		padding-top: 5vh;
		align-items: center;
		flex-direction: column;
		padding-right: 60px;
		
		@media (max-width: 1500px) {
			padding: 0 10%;
		}
		@media (max-width: 1200px) {
			padding: 0 5%;
		
	`

	const TopHeader = styled.div`
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
	`

	const Logo = styled.img`
		width: 150px;
		height: 35px;
		&:hover {
			cursor: pointer;
		}
	`

	const HeaderLink = styled.div`
	color: #333;
	font-size: 16px;
	font-weight: 500;
	padding: 10px 10px;
	border-bottom: 2px solid transparent;
	transition: all 0.3s ease;

	&:hover {
		cursor: pointer;
		border-bottom: 2px solid #a66cff;
		color : #a66cff;
		font-weight: 600;
		transition: all 0.3s ease;
	}
`


	const HeaderNavbar = styled.div`
		display: flex;
		padding: 0 15%;
		font-size: 20px;
		font-weight: bold;
		height: 80px;
		align-items: center;
	`
	const NavItem = styled.p`
		position: relative;
		padding: 10px 20px;
		font-size: 18px;
		font-weight: 800;
		color: #222;
		white-space: nowrap;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;

		&::after {
			content: '';
			position: absolute;
			bottom: -20px;
			left: 50%;
			transform: translateX(-50%);
			width: 0%;
			height: 5px;
			background-color: #a66cff;
			transition: width 0.25s ease;
		}

		&:hover::after {
			width: 100%;
		}

		@media (max-width: 768px) {
			font-size: 14px;
			padding: 8px 4px;
			margin: 0 8px;
		}
	`

	const Category = styled.img`
		width: 18px;
		height: 18px;
		padding-right: 5px;
	`

	const CategoryMenu = styled.p`
		
		&:hover {
			cursor: pointer;
		}
	`

	const ProjectButton = styled.button`
		background-color: #a66cff;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 16px;
		width: 150px;
		height: 40px;
		font-weight: bold;
		transition: background-color 0.3s;
		justify-content: between-space;
		&:hover {
			background-color:rgb(91, 48, 160);
		}
	`;

	const SearchBar = styled.div`
	width: 250px;
	height: 50px;
	background-color: #f5f5f5;
	display: flex;
	align-items: center;
	border-radius: 12px;
	margin-left: auto;
	padding: 0 12px;
	box-shadow: inset 0 0 0 2px transparent;
	transition: 0.3s ease, background-color 0.3s ease;

	&:hover {
		background-color: #ffffff;
		box-shadow: inset 0 0 0 2px #a66cff55;
		transform: scale(1.02);
	}
	&:focus-within {
		box-shadow: inset 0 0 0 2px #a66cff;
	}
`

const SearchInput = styled.input`
	background-color: transparent;
	border: none;
	height: 35px;
	width: 90%;
	font-size: 16px;
	color: #333;
	padding-left: 8px;
	transition: color 0.3s ease;

	&:focus {
		outline: none;
		color: #111;
	}

	&::placeholder {
		color: #999;
		transition: opacity 0.2s ease;
	}
`

const Search = styled.img`
	width: 20px;
	cursor: pointer;
	transition: filter 0.3s ease, transform 0.2s ease;
	&:hover {
		transform: scale(1.1)	;
	}
`


	const CategoryListLayout = styled.div<{ isOpen: boolean }>`
		overflow: hidden;
		max-height: ${({ isOpen }) => (isOpen ? '230px' : '0')};
		opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
		transition: max-height 0.6s ease, opacity 0.6s ease;
		background-color: #f3f3f3;
		/*display: flex;
		width: 100%;
		height: 160px;
		background-color: #f3f3f3;
		*/
	`

	const CategoryList = styled.div`
		display: grid;
		padding: 0 15%;
		margin-top: 8px;
		padding-bottom: 20px;
		grid-template-columns: repeat(auto-fill, minmax(18%, auto));
		column-gap: 20px;
		row-gap: 15px;
		justify-content: center;
	`



	const CategoryListItem = styled.p`
		font-size: 16px;
		width: 60%;
		text-align: center;
		margin: 20px 0;
		padding: 12px 0;
		border-bottom: 1px solid #aaaaaa;
		transition: all 0.3s ease;
		box-shadow: 0 0 0 rgba(0, 0, 0, 0);
		color: #333;

		&:hover {
			cursor: pointer;
			background-color: #f0eaff;
			color: #6a1b9a;
			transform: scale(1.05);
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
		}
	`


	const UserProfile = styled.img`
		width: 50px;
		height: 50px;
		border-radius: 50%;
		&:hover {
			cursor: pointer;
		}
	`

	const Notification = styled.img`
		width: 35px;
		height: 35px;
		&:hover {
			cursor: pointer;
		}
	`

	const NotificationWrapper = styled.div`
		position: relative;
	`

	const NotificationBox = styled.div`
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 10px;
		width: 250px;
		height: 300px;
		background-color: #f2f2f2;
		border-radius: 15px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		padding: 20px;
		z-index: 100;
	`

