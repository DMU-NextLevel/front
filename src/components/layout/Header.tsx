import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import LogoImage from '../../assets/images/withuLogo.png'
import CategoryImage from '../../assets/images/category.png'
import SearchImage from '../../assets/images/search.svg'
import UserImage from '../../assets/images/default_profile.png'
import NotificationImage from '../../assets/images/bell.png'
import { useNavigate } from 'react-router-dom'

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
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
	const [showNotification, setShowNotification] = useState<boolean>(false)
	const notificationRef = useRef<HTMLDivElement>(null)
	const navigate = useNavigate()

	const handleLogoClick = () => {
		navigate('/')
		setIsOpen(false)
	}

	const handleLoginClick = () => {
		navigate('/login')
		setIsOpen(false)
	}

	const handleCategoryClick = () => {
		setIsOpen(!isOpen)
	}

	const handleProjectCreate = () => {
		navigate('/project/create')
	}

	const handleProfileClick = () => {
		navigate('/profile')
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
			<HeaderLayout>
				<TopHeader>
					<Logo src={LogoImage} onClick={handleLogoClick} />
					{!isLoggedIn ? (
						<HeaderLink onClick={handleLoginClick}>로그인</HeaderLink>
					) : (
						<div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center', gap: '30px' }}>
							<NotificationWrapper>
								<Notification src={NotificationImage} onClick={toggleNotification} />
								{showNotification && <NotificationBox ref={notificationRef}>새 알림이 없습니다</NotificationBox>}
							</NotificationWrapper>
							<UserProfile src={UserImage} onClick={handleProfileClick} />
						</div>
					)}
				</TopHeader>
			</HeaderLayout>
			<HeaderNavbar>
				<CategoryMenu onClick={handleCategoryClick}>
					<Category src={CategoryImage} alt='' />
					카테고리
				</CategoryMenu>
				<p>인기</p>
				<p>신규</p>
				<p>마감임박</p>
				<ProjectButton onClick={handleProjectCreate}>프로젝트 시작하기</ProjectButton>
				<SearchBar>
					<SearchInput type='text' placeholder='검색어를 입력하세요' />
					<Search src={SearchImage} alt='' />
				</SearchBar>
			</HeaderNavbar>
			{
				<CategoryListLayout isOpen={isOpen}>
					<CategoryList>
						<CategoryListItem>가전</CategoryListItem>
						<CategoryListItem>뷰티</CategoryListItem>
						<CategoryListItem>패션</CategoryListItem>
						<CategoryListItem>도서</CategoryListItem>
						<CategoryListItem>굿즈</CategoryListItem>
						<CategoryListItem>게임</CategoryListItem>
						<CategoryListItem>만화</CategoryListItem>
						<CategoryListItem>사진</CategoryListItem>
						<CategoryListItem>음악</CategoryListItem>
						<CategoryListItem>교육</CategoryListItem>
						<CategoryListItem>스포츠</CategoryListItem>
						<CategoryListItem>푸드</CategoryListItem>
					</CategoryList>
				</CategoryListLayout>
			}
		</div>
	)
}

export const HeaderSub: React.FC = () => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
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
	padding: 0 20px;
	margin: 5px;
	padding-top: 2vh;
	align-items: center;
	flex-direction: column;
	padding-right: 60px;
`

const TopHeader = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
`

const Logo = styled.img`
	width: 200px;
	height: 45px;
	&:hover {
		cursor: pointer;
	}
`

const HeaderLink = styled.div`
	text-decoration: none;
	color: black;
	font-size: 16px;
	margin-left: auto;
	&:hover {
		cursor: pointer;
	}
`

const HeaderNavbar = styled.div`
	display: flex;
	padding: 0 60px;
	gap: 60px;
	font-size: 20px;
	font-weight: bold;
	height: 60px;
	align-items: center;
`

const Category = styled.img`
	width: 20px;
	height: 20px;
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
	font-size: 18px;
	font-weight: bold;
	width: 170px;
	height: 40px;
	border-radius: 10px;
	&:hover {
		cursor: pointer;
	}
`

const SearchBar = styled.div`
	width: 350px;
	height: 50px;
	background-color: #f3f3f3;
	display: flex;
	align-items: center;
	border-radius: 10px;
	margin-left: auto;
`
const SearchInput = styled.input`
	background-color: #f3f3f3;
	border: none;
	height: 35px;
	width: 290px;
	margin-left: 10px;
	font-size: 16px;
	&:focus {
		outline: none;
	}
`
const Search = styled.img`
	width: 20px;
	padding-left: 10px;
	&:hover {
		cursor: pointer;
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
	width: 100%;
	padding: 0 80px;
	margin-top: 8px;
	padding-bottom: 20px;
	grid-template-columns: repeat(auto-fill, minmax(18%, auto));
	column-gap: 30px;
	row-gap: 15px;
	justify-content: center;
`

const CategoryListItem = styled.p`
	font-size: 18px;
	width: 60%;
	margin: 10px 0;
	padding-bottom: 10px;
	border-bottom: 1px solid #aaaaaa;
	&:hover {
		cursor: pointer;
		background-color: #eaeaea;
		transition: background-color 0.2s ease;
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
