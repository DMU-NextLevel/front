import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { api } from '../../AxiosInstance'
import { fetchProjectsFromServer } from '../../hooks/fetchProjectsFromServer'
import noImage from '../../assets/images/noImage.jpg'
import defaultProfile from '../../assets/images/default_profile.png'

// 타입 단언을 위한 변수
const ApexChart = Chart as any

interface DashboardStats {
  totalUsers: number
  newUsers: number
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalFunding: number
}

interface RecentActivity {
  id: number
  type: 'signup' | 'project' | 'funding'
  user: string
  message: string
  time: string
}

interface RecentProject {
  id: number
  title: string
  titleImg: {
    id: number
    uri: string
  }
  completionRate: number
  userCount: number
}

interface AdminInfo {
  id: number
  name: string
  nickName: string
  email: string
  profileImage: string
  role: string
  browser: string
  os: string
  ip: string
  lastLogin: string
  socialProvider?: string
}

type NoticeArticle = {
  id: number
  title: string
  content: string
  createdAt: string
}

// 최근 공지사항 컴포넌트
const RecentNotices: React.FC = () => {
  const navigate = useNavigate()
  const [notices, setNotices] = useState<NoticeArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      const response = await api.get('/public/notice')
      if (response.data.message === 'success') {
        // 최신순으로 정렬하고 최근 5개만 가져오기
        const sortedNotices = response.data.data.sort((a: NoticeArticle, b: NoticeArticle) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        setNotices(sortedNotices.slice(0, 5))
      }
    } catch (error) {
      console.error('공지사항 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate)
    return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    )
  }

  if (notices.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <i className="bi bi-inbox text-3xl mb-2 block text-gray-300"></i>
        <p className="text-sm">등록된 공지사항이 없습니다.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {notices.map((notice) => (
        <li key={notice.id}>
          <button
            onClick={() => navigate(`/support/notice/${notice.id}`, { state: notice })}
            className="w-full flex items-center justify-between p-3 rounded-lg text-left hover:bg-blue-50 transition-all group border border-transparent hover:border-blue-200"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <i className="bi bi-megaphone text-blue-600 text-sm flex-shrink-0"></i>
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {notice.title}
              </p>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-3">
              {formatDate(notice.createdAt)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    newUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalFunding: 0,
  })

  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null)
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week')
  const [activeChartTab, setActiveChartTab] = useState<'visitor' | 'funding' | 'category' | 'success'>('visitor')
  const [recentActivities] = useState<RecentActivity[]>([
    { id: 1, type: 'signup', user: '새 회원', message: '회원가입이 완료되었습니다.', time: '2017년 12월 12일' },
    { id: 2, type: 'project', user: '김철수', message: '신규 프로젝트가 등록되었습니다.', time: '2017년 12월 09일' },
    { id: 3, type: 'funding', user: '이영희', message: '2017년 연말 후원 공지', time: '2017년 11월 29일' },
  ])

  const [popularProjects, setPopularProjects] = useState<RecentProject[]>([])

  useEffect(() => {
    fetchDashboardStats()
    fetchAdminInfo()
    fetchPopularProjects()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats')
      setStats(response.data)
    } catch (error) {
      console.warn('통계 로딩 실패, 더미 데이터 사용:', error)
      // 기본 더미 데이터 설정
      setStats({
        totalUsers: 150,
        newUsers: 12,
        totalProjects: 45,
        activeProjects: 23,
        completedProjects: 18,
        totalFunding: 125000000,
      })
    }
  }

  const fetchAdminInfo = async () => {
    try {
      const response = await api.get('/social/user')

      if (response.data.message === 'success' && response.data.data) {
        const userData = response.data.data

        // 브라우저 정보 가져오기
        const userAgent = navigator.userAgent
        let browser = 'Unknown'
        let os = 'Unknown'

        // 브라우저 감지
        if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
          browser = 'Chrome'
        } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
          browser = 'Safari'
        } else if (userAgent.indexOf('Firefox') > -1) {
          browser = 'Firefox'
        } else if (userAgent.indexOf('Edg') > -1) {
          browser = 'Edge'
        }

        // OS 감지
        if (userAgent.indexOf('Win') > -1) {
          os = 'Windows'
        } else if (userAgent.indexOf('Mac') > -1) {
          os = 'macOS'
        } else if (userAgent.indexOf('Linux') > -1) {
          os = 'Linux'
        }

        setAdminInfo({
          id: userData.img?.id || 0,
          name: userData.name,
          nickName: userData.nickName,
          email: userData.email,
          profileImage: userData.img?.uri || '',
          role: '관리자',
          browser: browser,
          os: os,
          ip: '127.0.0.1', // IP는 백엔드에서 제공하지 않으므로 기본값
          lastLogin: new Date().toISOString(),
          socialProvider: userData.socialProvider,
        })
      }
    } catch (error) {
      console.warn('관리자 정보 로딩 실패, 더미 데이터 사용:', error)
      // 브라우저 정보 가져오기
      const userAgent = navigator.userAgent
      let browser = 'Unknown'
      let os = 'Unknown'

      // 브라우저 감지
      if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
        browser = 'Chrome'
      } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
        browser = 'Safari'
      } else if (userAgent.indexOf('Firefox') > -1) {
        browser = 'Firefox'
      } else if (userAgent.indexOf('Edg') > -1) {
        browser = 'Edge'
      }

      // OS 감지
      if (userAgent.indexOf('Win') > -1) {
        os = 'Windows'
      } else if (userAgent.indexOf('Mac') > -1) {
        os = 'Linux'
      } else if (userAgent.indexOf('Linux') > -1) {
        os = 'Linux'
      }

      // 기본 더미 데이터 설정
      setAdminInfo({
        id: 1,
        name: '관리자',
        nickName: 'Admin',
        email: 'admin@nextlevel.com',
        profileImage: '',
        role: '최고 관리자',
        browser: browser,
        os: os,
        ip: '127.0.0.1',
        lastLogin: new Date().toISOString(),
      })
    }
  }

  const fetchPopularProjects = async () => {
    try {
      const data = await fetchProjectsFromServer({
        order: 'RECOMMEND',
        desc: true,
        pageCount: 3
      })
      if (Array.isArray(data) && data.length > 0) {
        setPopularProjects(data as RecentProject[])
      }
    } catch (error) {
      console.warn('인기 프로젝트 로딩 실패:', error)
    }
  }

  // 차트 데이터
  const chartData = {
    visitor: {
      week: {
        categories: ['월', '화', '수', '목', '금', '토', '일'],
        series: [5200, 6100, 5800, 7200, 8100, 9500, 8900]
      },
      month: {
        categories: ['1월', '2월', '3월', '4월', '5월', '6월'],
        series: [32000, 38000, 35000, 42000, 45000, 48000]
      }
    },
    funding: {
      week: {
        categories: ['월', '화', '수', '목', '금', '토', '일'],
        series: [125000000, 150000000, 180000000, 165000000, 200000000, 220000000, 190000000]
      },
      month: {
        categories: ['1월', '2월', '3월', '4월', '5월', '6월'],
        series: [850000000, 920000000, 1050000000, 980000000, 1150000000, 1250000000]
      }
    },
    category: {
      categories: ['테크/가전', '패션/잡화', '뷰티/헬스', '라이프', '푸드', '문화/예술'],
      series: [35, 28, 22, 18, 15, 10]
    },
    success: {
      categories: ['1월', '2월', '3월', '4월', '5월', '6월'],
      series: [82, 85, 83, 88, 86, 87.5]
    }
  }

  // 방문자 차트 옵션
  const visitorChartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 800 }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    colors: ['#3B82F6'],
    xaxis: {
      categories: chartPeriod === 'week' ? chartData.visitor.week.categories : chartData.visitor.month.categories,
      labels: { style: { colors: '#64748B', fontSize: '11px' } }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748B', fontSize: '11px' },
        formatter: (val) => val.toLocaleString()
      }
    },
    grid: { borderColor: '#E2E8F0', strokeDashArray: 4 },
    tooltip: { y: { formatter: (val) => val.toLocaleString() + '명' } }
  }

  const visitorChartSeries = [{
    name: '방문자 수',
    data: chartPeriod === 'week' ? chartData.visitor.week.series : chartData.visitor.month.series
  }]

  // 펀딩 차트 옵션
  const fundingChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 280,
      toolbar: { show: false },
      animations: { enabled: true, speed: 800 }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%',
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => (Number(val) / 100000000).toFixed(1) + '억',
      offsetY: -20,
      style: { fontSize: '10px', colors: ['#64748B'] }
    },
    colors: ['#8B5CF6'],
    xaxis: {
      categories: chartPeriod === 'week' ? chartData.funding.week.categories : chartData.funding.month.categories,
      labels: { style: { colors: '#64748B', fontSize: '11px' } }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748B', fontSize: '11px' },
        formatter: (val) => (val / 100000000).toFixed(1) + '억'
      }
    },
    grid: { borderColor: '#E2E8F0', strokeDashArray: 4 },
    tooltip: { y: { formatter: (val) => val.toLocaleString() + '원' } }
  }

  const fundingChartSeries = [{
    name: '펀딩 금액',
    data: chartPeriod === 'week' ? chartData.funding.week.series : chartData.funding.month.series
  }]

  // 카테고리 차트 옵션
  const categoryChartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      height: 280,
      animations: { enabled: true, speed: 800 }
    },
    labels: chartData.category.categories,
    colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1'],
    legend: {
      position: 'bottom',
      fontSize: '11px',
      labels: { colors: '#64748B' }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: '전체',
              fontSize: '12px',
              color: '#64748B',
              formatter: () => chartData.category.series.reduce((a, b) => a + b, 0).toString()
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => Math.round(Number(val)) + '%',
      style: { fontSize: '10px' }
    },
    tooltip: { y: { formatter: (val) => val + '개' } }
  }

  // 성공률 차트 옵션
  const successChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 280,
      toolbar: { show: false },
      animations: { enabled: true, speed: 800 }
    },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#10B981'],
    markers: {
      size: 5,
      strokeWidth: 2,
      hover: { size: 7 }
    },
    xaxis: {
      categories: chartData.success.categories,
      labels: { style: { colors: '#64748B', fontSize: '11px' } }
    },
    yaxis: {
      min: 70,
      max: 100,
      labels: {
        style: { colors: '#64748B', fontSize: '11px' },
        formatter: (val) => val.toFixed(1) + '%'
      }
    },
    grid: { borderColor: '#E2E8F0', strokeDashArray: 4 },
    tooltip: { y: { formatter: (val) => val.toFixed(1) + '%' } }
  }

  const successChartSeries = [{
    name: '성공률',
    data: chartData.success.series
  }]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'signup':
        return 'bi-person-plus'
      case 'project':
        return 'bi-folder-plus'
      case 'funding':
        return 'bi-credit-card'
      default:
        return 'bi-bell'
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-delay-100 {
          animation-delay: 0.1s;
          animation-fill-mode: backwards;
        }

        .animate-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: backwards;
        }

        .animate-delay-300 {
          animation-delay: 0.3s;
          animation-fill-mode: backwards;
        }

        .animate-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: backwards;
        }
      `}</style>

      {/* 상단 헤더 */}
      <div className="flex justify-between items-center animate-slideInLeft">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-sm text-gray-600 mt-1">NextLevel 플랫폼 관리</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.open('/', '_blank')}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <i className="bi bi-box-arrow-up-right me-2"></i>
            사이트 보기
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 총 펀딩 금액 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow animate-scaleIn animate-delay-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">총 펀딩 금액</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-currency-dollar text-blue-600 text-xl"></i>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">₩{stats.totalFunding.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-2">
            <i className="bi bi-arrow-up"></i> 전월 대비 12.5% 증가
          </p>
        </div>

        {/* 진행 중인 프로젝트 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow animate-scaleIn animate-delay-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">진행 중인 프로젝트</h3>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-rocket-takeoff text-green-600 text-xl"></i>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}개</p>
          <p className="text-xs text-gray-500 mt-2">
            총 {stats.totalProjects}개 중 {stats.completedProjects}개 완료
          </p>
        </div>

        {/* 신규 가입자 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow animate-scaleIn animate-delay-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">신규 가입자</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-person-plus text-purple-600 text-xl"></i>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.newUsers}명</p>
          <p className="text-xs text-gray-500 mt-2">
            총 회원 {stats.totalUsers}명
          </p>
        </div>

        {/* 완료된 프로젝트 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow animate-scaleIn animate-delay-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">완료된 프로젝트</h3>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-check-circle text-yellow-600 text-xl"></i>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.completedProjects}개</p>
          <p className="text-xs text-green-600 mt-2">
            성공률 {Math.round((stats.completedProjects / stats.totalProjects) * 100)}%
          </p>
        </div>
      </div>

      {/* 빠른 작업 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-3">빠른 작업</h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <i className="bi bi-people text-blue-600"></i>
            <span className="text-sm font-medium text-gray-900">유저 관리</span>
          </button>

          <button
            onClick={() => navigate('/admin/projects')}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <i className="bi bi-folder text-green-600"></i>
            <span className="text-sm font-medium text-gray-900">프로젝트 관리</span>
          </button>

          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <i className="bi bi-graph-up text-purple-600"></i>
            <span className="text-sm font-medium text-gray-900">통계 상세</span>
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽 영역 (2칸) */}
        <div className="lg:col-span-2 space-y-6 animate-slideInLeft animate-delay-200">
          {/* 통계 차트 - 탭 형식 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">통계 요약</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartPeriod('week')}
                  className={`px-3 py-1 text-xs rounded transition-all ${
                    chartPeriod === 'week'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  주간
                </button>
                <button
                  onClick={() => setChartPeriod('month')}
                  className={`px-3 py-1 text-xs rounded transition-all ${
                    chartPeriod === 'month'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  월간
                </button>
              </div>
            </div>

            {/* 탭 버튼 */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveChartTab('visitor')}
                className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeChartTab === 'visitor'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="bi bi-people mr-1"></i>
                방문자
              </button>
              <button
                onClick={() => setActiveChartTab('funding')}
                className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeChartTab === 'funding'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="bi bi-cash-stack mr-1"></i>
                펀딩
              </button>
              <button
                onClick={() => setActiveChartTab('category')}
                className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeChartTab === 'category'
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="bi bi-pie-chart mr-1"></i>
                카테고리
              </button>
              <button
                onClick={() => setActiveChartTab('success')}
                className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeChartTab === 'success'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="bi bi-graph-up-arrow mr-1"></i>
                성공률
              </button>
            </div>

            {/* 차트 영역 */}
            <div className="relative">
              {activeChartTab === 'visitor' && (
                <ApexChart
                  options={visitorChartOptions}
                  series={visitorChartSeries}
                  type="area"
                  height={280}
                />
              )}
              {activeChartTab === 'funding' && (
                <ApexChart
                  options={fundingChartOptions}
                  series={fundingChartSeries}
                  type="bar"
                  height={280}
                />
              )}
              {activeChartTab === 'category' && (
                <ApexChart
                  options={categoryChartOptions}
                  series={chartData.category.series}
                  type="donut"
                  height={280}
                />
              )}
              {activeChartTab === 'success' && (
                <ApexChart
                  options={successChartOptions}
                  series={successChartSeries}
                  type="line"
                  height={280}
                />
              )}
            </div>

            {/* 하단 통계 */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
              <div>
                <p className="text-xs text-gray-500 mb-1">총 신규회원 수</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newUsers}명</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">총 펀딩 금액</p>
                <p className="text-2xl font-bold text-gray-900">₩{stats.totalFunding.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* 인기 프로젝트 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">실시간 인기 프로젝트</h2>
              <button
                onClick={() => navigate('/admin/projects')}
                className="text-sm text-blue-600 hover:underline"
              >
                전체보기
              </button>
            </div>
            {popularProjects.length > 0 ? (
              <ul className="space-y-2">{popularProjects.map((project, index) => (
                  <li key={project.id}>
                    <button
                      onClick={() => navigate(`/admin/projects`)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="inline-flex items-center justify-center w-7 h-7 text-purple-600 text-base font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">
                          {project.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          <span className="text-purple-600 font-semibold">{project.completionRate}%</span> · 후원자 {project.userCount?.toLocaleString() || 0}명
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-28 rounded-lg overflow-hidden bg-gray-50 ring-1 ring-gray-200">
                        <div className="w-full h-full" style={{ aspectRatio: '16 / 9' }}>
                          {project.titleImg ? (
                            <img
                              src={project.titleImg.uri}
                              alt={project.title}
                              onError={(e) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.src = noImage
                              }}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              이미지 없음
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">인기 프로젝트가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 활동 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">활동</h2>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className={`bi ${getActivityIcon(activity.type)} text-gray-600 text-sm`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.user} · {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽 영역 (1칸) */}
        <div className="space-y-6 animate-slideInRight animate-delay-300">
          {/* 관리자 정보 카드 */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white">
            {adminInfo ? (
              <>
                <div className="flex flex-col items-center mb-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden mb-3">
                    {adminInfo.profileImage && !imageError ? (
                      <>
                        {imageLoading && (
                          <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        <img
                          src={adminInfo.profileImage}
                          alt={adminInfo.name}
                          className={`w-full h-full object-cover ${imageLoading ? 'hidden' : 'block'}`}
                          onLoad={() => setImageLoading(false)}
                          onError={() => {
                            setImageError(true)
                            setImageLoading(false)
                          }}
                        />
                      </>
                    ) : (
                      <img
                        src={defaultProfile}
                        alt={adminInfo.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold">{adminInfo.name}</h3>
                  <p className="text-xs text-blue-200 mt-1">@{adminInfo.nickName}</p>
                  <p className="text-xs text-blue-200">{adminInfo.email}</p>
                  <span className="mt-2 px-3 py-1 bg-blue-500 rounded-full text-xs font-semibold">
                    {adminInfo.role}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-blue-500">
                  <div className="flex items-center gap-2 text-sm">
                    <i className="bi bi-browser-chrome text-blue-200"></i>
                    <span className="text-gray-200">브라우저:</span>
                    <span className="ml-auto font-medium">{adminInfo.browser}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <i className="bi bi-laptop text-blue-200"></i>
                    <span className="text-gray-200">OS:</span>
                    <span className="ml-auto font-medium">{adminInfo.os}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <i className="bi bi-wifi text-blue-200"></i>
                    <span className="text-gray-200">IP:</span>
                    <span className="ml-auto font-medium">{adminInfo.ip}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <i className="bi bi-clock text-blue-200"></i>
                    <span className="text-gray-200">마지막 로그인:</span>
                    <span className="ml-auto font-medium text-xs">
                      {new Date(adminInfo.lastLogin).toLocaleString('ko-KR')}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3">
                  <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-sm text-blue-200">정보를 불러오는 중...</p>
              </div>
            )}
          </div>

          {/* 운영진 설정 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-gray-900">운영진 설정</h3>
              <button className="text-sm text-blue-600 hover:underline">관리</button>
            </div>
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* 공지사항 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">공지</h2>
              <button
                onClick={() => navigate('/admin/notices')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all border border-blue-200"
              >
                <i className="bi bi-gear text-sm"></i>
                관리
              </button>
            </div>
            <RecentNotices />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
