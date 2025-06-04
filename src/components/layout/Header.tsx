	import React, { useEffect, useRef, useState } from 'react'
	import styled from 'styled-components'
	import LogoImage from '../../assets/images/withuLogo.png'
	import CategoryImage from '../../assets/images/category.png'
	import SearchImage from '../../assets/images/search.svg'
	import UserImage from '../../assets/images/default_profile.png'
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

	const categories = [
		{ label: '테크/가전', icon: 'bi bi-cpu', tag: '1' },
		{ label: '라이프스타일', icon: 'bi bi-house', tag: '2' },
		{ label: '패션/잡화', icon: 'bi bi-bag', tag: '3' },
		{ label: '뷰티/헬스', icon: 'bi bi-heart-pulse', tag: '4' },
		{ label: '취미/DIY', icon: 'bi bi-brush', tag: '5' },
		{ label: '게임', icon: 'bi bi-controller', tag: '6' },
		{ label: '교육/키즈', icon: 'bi bi-book', tag: '7' },
		{ label: '반려동물', icon: 'bi bi-star', tag: '8' },
		{ label: '여행/레저', icon: 'bi bi-airplane', tag: '9' },
		{ label: '푸드/음료', icon: 'bi bi-cup-straw', tag: '10' },
	];
	
	// 링크 설정 객체
	const searchLinks = {
		RECOMMEND: '/search?order=RECOMMEND',
		NEW: '/search?order=NEW',
		EXPIRED: '/search?order=EXPIRED',
		COMPLETED: '/search?order=COMPLETED'
	};
	
	// 링크 생성 함수
	const createSearchLink = (type: keyof typeof searchLinks) => {
		return searchLinks[type];
	};

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
			<HeaderWrapper>
				<TopHeader>
					<Logo src={LogoImage} onClick={handleLogoClick} />
					{!isLoggedIn ? (
							<div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center', gap: '0px' }}>
								<HeaderLink onClick={handleLoginClick}>로그인</HeaderLink>
								<HeaderLink onClick={handleSignupClick}>회원가입</HeaderLink>
							</div>
						) : (
							<div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center', gap: '30px' }}>
								<NotificationWrapper>
									<Notification onClick={toggleNotification}>
										<i className={showNotification ? 'bi bi-bell-fill' : 'bi bi-bell'}></i>
									</Notification>
									{showNotification && <NotificationBox ref={notificationRef}>새 알림이 없습니다</NotificationBox>}
								</NotificationWrapper>
								<UserProfile src={UserImage} onClick={handleProfileClick} />
							</div>
						)}
				</TopHeader>
				<HeaderNavbar>
					
					<CategoryMenu onClick={handleCategoryClick}>
						
						<NavItem><Category src={CategoryImage} alt='' /> 메뉴</NavItem>
					</CategoryMenu>
					
					<NavItem><a href={createSearchLink('RECOMMEND')}>인기</a></NavItem>
					<NavItem><a href={createSearchLink('NEW')}>신규</a></NavItem>
					<NavItem><a href={createSearchLink('EXPIRED')}>마감임박</a></NavItem>
					<ProjectButton onClick={handleProjectCreate}>프로젝트 시작하기</ProjectButton>
					<SearchBar>
						<SearchInput type='text' placeholder='검색어를 입력하세요' />
						<SearchButton>
							<i className="bi bi-search"></i>
						</SearchButton>
					</SearchBar>
					
				</HeaderNavbar>
				{
					<CategoryListLayout isOpen={isOpen}>
					<CategorySection style={{ border: 'none', padding: '0px 20px 0 20px'}}>
						<CategorySectionButton>
							<i className="bi bi-bookmark-check"></i><div>팔로우 프로젝트</div>
						</CategorySectionButton>
						<CategorySectionButton onClick={handleProjectCreate} bgColor="rgb(233, 236, 239)"  hoverColor="rgb(206, 208, 211)">
							<i className="bi bi-buildings"></i><div>메이커 스튜디오</div>
						</CategorySectionButton>
						<CategorySectionButton bgColor="rgb(230, 246, 255)"  hoverColor="rgb(216, 228, 234)">
							<i className="bi bi-box2"></i><div>즐겨찾기</div>
						</CategorySectionButton>
					</CategorySection>
					<CategorySection>
						<h3>카테고리</h3>
						<CategoryList>
							{categories.map((cat) => (
								<CategoryListItem
								key={cat.tag}
								onClick={() =>
									navigate(`/search?tag=${cat.tag}`, {
									  state: cat.tag
									})
								  }
								>
								<i className={cat.icon}></i> {cat.label}
								</CategoryListItem>
							))}
						</CategoryList>
					</CategorySection>
					<CategorySection>
						<h3>프로젝트</h3>
						<NavSection>
							<NavSectionItem><a href={createSearchLink('RECOMMEND')}>인기 프로젝트 보기</a></NavSectionItem>
							<NavSectionItem><a href={createSearchLink('RECOMMEND')}>추천 프로젝트</a></NavSectionItem>
							<NavSectionItem><a href={createSearchLink('NEW')}>신규 프로젝트</a></NavSectionItem>
							<NavSectionItem><a href={createSearchLink('EXPIRED')}>마감 임박 프로젝트</a></NavSectionItem>
							<NavSectionItem><a href={createSearchLink('COMPLETED')}>완료된 프로젝트</a></NavSectionItem>
						</NavSection>
						</CategorySection>
						<CategorySection>
							<h3>도구/서비스</h3>
							<NavSection>
								<NavSectionItem><a href="">공지사항</a></NavSectionItem>
								<NavSectionItem><a href="">고객센터</a></NavSectionItem>
								<NavSectionItem><a href="/mypage">마이페이지</a></NavSectionItem>
								<NavSectionItem><a href="">정책 & 약관</a></NavSectionItem>
								
						</NavSection>
					</CategorySection>
					
					</CategoryListLayout>
				}
			</HeaderWrapper>
		)
	}

	export const HeaderSub: React.FC = () => {
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
				<SubHeaderWrapper>
					<HeaderNavbar >
					<Logo src={LogoImage} onClick={handleLogoClick} />
						<CategoryMenu onClick={handleCategoryClick}>
							
							<NavItem><Category src={CategoryImage} alt='' /> 메뉴</NavItem>
						</CategoryMenu>
						<NavItem><a href="/search?order=RECOMMEND">인기</a></NavItem>
						<NavItem><a href="/search?order=NEW">신규</a></NavItem>
						<NavItem><a href="/search?order=EXPIRED">마감임박</a></NavItem>

						<div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center', gap: '0px', marginRight: '20px' }}>
							<SearchBar style={{ marginRight: '20px' }}>
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
											<Notification onClick={toggleNotification}>
												<i className={showNotification ? 'bi bi-bell-fill' : 'bi bi-bell'}></i>
											</Notification>
											{showNotification && <NotificationBox ref={notificationRef}>새 알림이 없습니다</NotificationBox>}
										</NotificationWrapper>
										<UserProfile src={UserImage} onClick={handleProfileClick} />
									</div>
								)}
							</div>
					</HeaderNavbar>
					{
					<CategoryListLayout isOpen={isOpen}>
					<CategorySection style={{ border: 'none', padding: '0px 20px 0 20px'}}>
						<CategorySectionButton>
							<i className="bi bi-bookmark-check"></i><div>팔로우 프로젝트</div>
						</CategorySectionButton>
						<CategorySectionButton onClick={handleProjectCreate} bgColor="rgb(233, 236, 239)"  hoverColor="rgb(206, 208, 211)">
							<i className="bi bi-buildings"></i><div>메이커 스튜디오</div>
						</CategorySectionButton>
						<CategorySectionButton bgColor="rgb(230, 246, 255)"  hoverColor="rgb(216, 228, 234)">
							<i className="bi bi-box2"></i><div>즐겨찾기</div>
						</CategorySectionButton>
					</CategorySection>
					<CategorySection>
						<h3>카테고리</h3>
						<CategoryList>
							{categories.map((cat) => (
								<CategoryListItem
								key={cat.tag}
								onClick={() =>
									navigate(`/search?tag=${cat.tag}`, {
									  state: cat.tag
									})
								  }
								>
								<i className={cat.icon}></i> {cat.label}
								</CategoryListItem>
							))}
						</CategoryList>
					</CategorySection>
					<CategorySection>
						<h3>프로젝트</h3>
						<NavSection>
							<NavSectionItem><a href={createSearchLink('RECOMMEND')}>인기 프로젝트 보기</a></NavSectionItem>
							<NavSectionItem><a href={createSearchLink('RECOMMEND')}>추천 프로젝트</a></NavSectionItem>
							<NavSectionItem><a href={createSearchLink('NEW')}>신규 프로젝트</a></NavSectionItem>
							<NavSectionItem><a href={createSearchLink('EXPIRED')}>마감 임박 프로젝트</a></NavSectionItem>
							<NavSectionItem><a href={createSearchLink('COMPLETED')}>완료된 프로젝트</a></NavSectionItem>
						</NavSection>
					</CategorySection>
					<CategorySection>
						<h3>도구/서비스</h3>
						<NavSection>
								<NavSectionItem><a href="">공지사항</a></NavSectionItem>
								<NavSectionItem><a href="">고객센터</a></NavSectionItem>
								<NavSectionItem><a href="/mypage">마이페이지</a></NavSectionItem>
								<NavSectionItem><a href="">정책 & 약관</a></NavSectionItem>
								
						</NavSection>
					</CategorySection>
					
					</CategoryListLayout>
				}
				</SubHeaderWrapper>
			</div>
		)
	}

	const HeaderWrapper = styled.div`
		padding: 0 15%;
		@media (max-width: 1500px) {
			padding: 0 10%;
		}
		@media (max-width: 1200px) {
			padding: 0 5%;
		
	`;
	
	const SubHeaderWrapper = styled.div`
		padding: 0 15%;
		border-bottom: 1px solidrgb(215, 215, 215);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 아래 방향 그림자 */
		
	`;

	const TopHeader = styled.div`
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 15px;
		width: 100%;
	`
	

	const Logo = styled.img`
		width: 150px;
		height: 35px;
		transition: all 0.3s ease;
		&:hover {
			cursor: pointer;
			transform: scale(1.05);
			transition: all 0.3s ease;
		}
	`

	const HeaderLink = styled.div`
		color: #333;
		font-size: 16px;
		font-weight: 500;
		padding: 10px 10px;
		margin: 0 5px;
		border-bottom: 2px solid transparent;
		transition: all 0.3s ease;

		&:hover {
			cursor: pointer;
			color : #a66cff;
			transform: scale(1.02);
			transition: all 0.3s ease;
		}
			&::after {
			content: '';
			position: absolute;
			bottom: 0px;
			left: 50%;
			transform: translateX(-50%);
			width: 0%;
			height: 3px;
			background-color: #a66cff;
			transition: width 0.25s ease;
		}

		&:hover::after {
			width: 100%;
		}
	`


	const HeaderNavbar = styled.div`
		display: flex;
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
		a {
			text-decoration: none;
			color: #222;
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
	height: 40px;
	background-color: #fff;
	display: flex;
	align-items: center;
	border-radius: 50px;
	border: 1px solid	rgb(209, 208, 208);
	margin-left: auto;
	padding: 0 12px;
	box-shadow: inset 0 0 0 2px transparent;
	transition: 0.3s ease, background-color 0.3s ease;

	&:hover {
		background-color: #f5f5f5;
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
		font-size: 15px;
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
	const SearchButton = styled.div`
	width: 20px;
	font-weight: bold;
	cursor: pointer;
	transition: filter 0.3s ease, transform 0.2s ease;
	&:hover {
		transform: scale(1.1)	;
	}
`


	const CategoryListLayout = styled.div<{ isOpen: boolean }>`
		overflow: hidden;
		max-height: ${({ isOpen }) => (isOpen ? '400px' : '0')};
		opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
		transition: max-height 0.6s ease, opacity 0.6s ease;
		display: flex;
		justify-content: center;

	`
	const CategorySection = styled.div`
		margin: 40px 0 ;
		padding:  0 50px 0 20px;
		border-left: 1px solid #ddd;
		min-width : 150px;
		h3 {
			color: #333;
			font-size: 14px;
			font-weight: 600;
			padding: 0;
			margin: 0 0 15px 0;
			}
	`
	const CategoryList = styled.div`
		display: grid;
		margin-top: 2px;

		grid-template-columns: repeat(2, 1fr);
		row-gap: 15px;                         
		column-gap: 40px;                      
		min-width: 100px;
	`;
	const CategorySectionButton = styled.div<{
		bgColor?: string;
		hoverColor?: string;
	  }>`
		background: ${({ bgColor }) => bgColor || 'rgb(255, 248, 231)'};
		display: flex;
		align-items: center;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 14px;
		text-align: left;
		width: 200px;
		padding: 10px 0px 10px 20px;
		font-weight: bold;
		transition: background-color 0.1s;
		margin-bottom: 10px;
	  
		&:hover {
		  background-color: ${({ hoverColor }) => hoverColor || 'rgb(238, 232, 217)'};
		}
	  
		div {
		  align-items: center;
		  justify-content: center;
		}
	  
		i {
		  background: white;
		  padding: 5px;
		  color: black;
		  border-radius: 5px;
		  font-size: 22px;
		  margin-right: 10px;
		}
	  `;
	  
	
	
	

	const CategoryListItem = styled.p`
		font-size: 15px;
		text-align: left;
		margin: 0 0;
		padding:  0;
	
		transition: all 0.3s ease;
		box-shadow: 0 0 0 rgba(0, 0, 0, 0);
		color: #333;

		&:hover {
			cursor: pointer;
			color: #6a1b9a;
			transform: scale(1.05);
			transition: all 0.3s ease;
		}

		a {
			text-decoration: none;
			color: #333;
		}
	`

	const NavSection = styled.div`
		display: block;
		margin-top: 2px;

		grid-template-columns: repeat(2, 1fr);
		row-gap: 12px;                         
		column-gap: 20px;                      
		min-width: 100px;
		font-size: 15px;

		a{
			text-decoration: none;
			color: #333;
		}
	`;
	const NavSectionItem = styled.p`
		font-size: 15px;
		text-align: left;
		margin: 0 0 15px 0;
		padding:  0;
	
		transition: all 0.3s ease;
		box-shadow: 0 0 0 rgba(0, 0, 0, 0);
		color: #333;

		&:hover {
			cursor: pointer;
			color: #6a1b9a;
			transform: scale(1.05);
			transition: all 0.3s ease;
		}

		a {
			text-decoration: none;
			color: #333;
		}
	`;
	
	const UserProfile = styled.img`
		width: 30px;
		height: 30px;
		border-radius: 50%;
		transition: all 0.3s ease;
		&:hover {
			cursor: pointer;
			transform: scale(1.1);
			transition: all 0.3s ease;
		}
	`

	const Notification = styled.div`
		i {
			font-size: 25px;
			color: #555;
			transition: color 0.3s ease, font-size 0.3s ease, transform 0.3s ease;

			&:hover {
				cursor: pointer;
				color:#555;	
				transform: scale(1.1);
				transition: all 0.3s ease;
			}
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

