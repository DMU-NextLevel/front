import React, { useState } from 'react'
import styled from 'styled-components'
import LogoImage from '../../assets/images/withuLogo.png'
import CategoryImage from '../../assets/images/category.png'
import SearchImage from '../../assets/images/search.svg'
import UserImage from '../../assets/images/default_profile.png'
import NotificationImage from '../../assets/images/bell.png'
import { useNavigate } from 'react-router-dom'

export const HeaderMain: React.FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
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

	return (
		<div>
			<HeaderLayout>
				<TopHeader>
					<Logo src={LogoImage} onClick={handleLogoClick} />
					{/*<HeaderLink onClick={handleLoginClick}>로그인</HeaderLink>*/}
					<div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center', gap: '30px' }}>
						<Notification src={NotificationImage} />
						<UserProfile src={UserImage} />
					</div>
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
				<ProjectButton>프로젝트 시작하기</ProjectButton>
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
	const navigate = useNavigate()

	const handleLoginClick = () => {
		navigate('/login')
	}

	const handleLogoClick = () => {
		navigate('/')
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
				{/*<HeaderLink onClick={handleLoginClick}>로그인</HeaderLink>*/}
				<div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center', gap: '30px' }}>
					<SearchBar>
						<SearchInput type='text' placeholder='검색어를 입력하세요' />
						<Search src={SearchImage} alt='' />
					</SearchBar>
					<Notification src={NotificationImage} />
					<UserProfile src={UserImage} />
                    <ProjectButton>프로젝트 시작하기</ProjectButton>
				</div>
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
	font-size: 20px;
	width: 190px;
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
	max-height: ${({ isOpen }) => (isOpen ? '200px' : '0')};
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
	grid-template-columns: repeat(auto-fill, minmax(20%, auto));
	column-gap: 30px;
	justify-content: center;
`

const CategoryListItem = styled.p`
	font-size: 18px;
	width: 60px;
	margin: 10px 0;
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
