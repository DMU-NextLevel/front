import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const AdminDashboard: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month'>('week')

  // 더미 데이터
  const stats = {
    totalVisitors: 45231,
    totalFunding: 1250000000,
    activeProjects: 128,
    successRate: 87.5,
    visitorChange: 12.5,
    fundingChange: 8.3,
    projectChange: 15.2,
    rateChange: 2.1
  }

  // 방문자 추이 데이터 (주간/월간)
  const visitorData = {
    week: {
      categories: ['월', '화', '수', '목', '금', '토', '일'],
      series: [5200, 6100, 5800, 7200, 8100, 9500, 8900]
    },
    month: {
      categories: ['1월', '2월', '3월', '4월', '5월', '6월'],
      series: [32000, 38000, 35000, 42000, 45000, 48000]
    }
  }

  // 펀딩 금액 추이 데이터
  const fundingData = {
    week: {
      categories: ['월', '화', '수', '목', '금', '토', '일'],
      series: [125000000, 150000000, 180000000, 165000000, 200000000, 220000000, 190000000]
    },
    month: {
      categories: ['1월', '2월', '3월', '4월', '5월', '6월'],
      series: [850000000, 920000000, 1050000000, 980000000, 1150000000, 1250000000]
    }
  }

  // 카테고리별 프로젝트 수
  const categoryProjects = {
    categories: ['테크/가전', '패션/잡화', '뷰티/헬스', '라이프', '푸드', '문화/예술'],
    series: [35, 28, 22, 18, 15, 10]
  }

  // 성공률 추이
  const successRateData = {
    categories: ['1월', '2월', '3월', '4월', '5월', '6월'],
    series: [82, 85, 83, 88, 86, 87.5]
  }

  // 방문자 추이 차트 옵션
  const visitorChartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        speed: 800,
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3
    },
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
      categories: period === 'week' ? visitorData.week.categories : visitorData.month.categories,
      labels: {
        style: { colors: '#64748B', fontSize: '12px' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748B', fontSize: '12px' },
        formatter: (val) => val.toLocaleString()
      }
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: (val) => val.toLocaleString() + '명'
      }
    }
  }

  const visitorChartSeries = [{
    name: '방문자 수',
    data: period === 'week' ? visitorData.week.series : visitorData.month.series
  }]

  // 펀딩 금액 차트 옵션
  const fundingChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 800,
      }
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
      style: {
        fontSize: '11px',
        colors: ['#64748B']
      }
    },
    colors: ['#8B5CF6'],
    xaxis: {
      categories: period === 'week' ? fundingData.week.categories : fundingData.month.categories,
      labels: {
        style: { colors: '#64748B', fontSize: '12px' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748B', fontSize: '12px' },
        formatter: (val) => (val / 100000000).toFixed(1) + '억'
      }
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: (val) => val.toLocaleString() + '원'
      }
    }
  }

  const fundingChartSeries = [{
    name: '펀딩 금액',
    data: period === 'week' ? fundingData.week.series : fundingData.month.series
  }]

  // 카테고리별 프로젝트 도넛 차트
  const categoryChartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      height: 320,
      animations: {
        enabled: true,
        speed: 800,
      }
    },
    labels: categoryProjects.categories,
    colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1'],
    legend: {
      position: 'bottom',
      fontSize: '13px',
      labels: { colors: '#64748B' }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: '전체 프로젝트',
              fontSize: '14px',
              color: '#64748B',
              formatter: () => categoryProjects.series.reduce((a, b) => a + b, 0).toString()
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => Math.round(Number(val)) + '%'
    },
    tooltip: {
      y: {
        formatter: (val) => val + '개 프로젝트'
      }
    }
  }

  // 성공률 추이 라인 차트
  const successRateChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 320,
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 800,
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#10B981'],
    markers: {
      size: 5,
      strokeWidth: 2,
      hover: { size: 7 }
    },
    xaxis: {
      categories: successRateData.categories,
      labels: {
        style: { colors: '#64748B', fontSize: '12px' }
      }
    },
    yaxis: {
      min: 70,
      max: 100,
      labels: {
        style: { colors: '#64748B', fontSize: '12px' },
        formatter: (val) => val.toFixed(1) + '%'
      }
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: (val) => val.toFixed(1) + '%'
      }
    }
  }

  const successRateChartSeries = [{
    name: '성공률',
    data: successRateData.series
  }]

  return (
    <div className="space-y-6 pb-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">통계 대시보드</h1>
          <p className="text-sm text-gray-600 mt-1">실시간 플랫폼 통계를 확인하세요</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('week')}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
              period === 'week'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <i className="bi bi-calendar-week mr-2"></i>주간
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
              period === 'month'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <i className="bi bi-calendar-month mr-2"></i>월간
          </button>
        </div>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 총 방문자 */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <i className="bi bi-people text-white text-xl"></i>
            </div>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              stats.visitorChange > 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <i className={`bi bi-arrow-${stats.visitorChange > 0 ? 'up' : 'down'} mr-1`}></i>
              {Math.abs(stats.visitorChange)}%
            </span>
          </div>
          <p className="text-sm text-blue-700 font-medium mb-1">총 방문자</p>
          <p className="text-3xl font-bold text-blue-900">{stats.totalVisitors.toLocaleString()}</p>
        </div>

        {/* 총 펀딩 금액 */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200/50 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
              <i className="bi bi-cash-stack text-white text-xl"></i>
            </div>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              stats.fundingChange > 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <i className={`bi bi-arrow-${stats.fundingChange > 0 ? 'up' : 'down'} mr-1`}></i>
              {Math.abs(stats.fundingChange)}%
            </span>
          </div>
          <p className="text-sm text-purple-700 font-medium mb-1">총 펀딩 금액</p>
          <p className="text-3xl font-bold text-purple-900">{(stats.totalFunding / 100000000).toFixed(1)}억</p>
        </div>

        {/* 진행 중인 프로젝트 */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-2xl p-6 border border-pink-200/50 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200">
              <i className="bi bi-folder text-white text-xl"></i>
            </div>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              stats.projectChange > 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <i className={`bi bi-arrow-${stats.projectChange > 0 ? 'up' : 'down'} mr-1`}></i>
              {Math.abs(stats.projectChange)}%
            </span>
          </div>
          <p className="text-sm text-pink-700 font-medium mb-1">진행 중인 프로젝트</p>
          <p className="text-3xl font-bold text-pink-900">{stats.activeProjects}</p>
        </div>

        {/* 평균 성공률 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200/50 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
              <i className="bi bi-graph-up-arrow text-white text-xl"></i>
            </div>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              stats.rateChange > 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <i className={`bi bi-arrow-${stats.rateChange > 0 ? 'up' : 'down'} mr-1`}></i>
              {Math.abs(stats.rateChange)}%
            </span>
          </div>
          <p className="text-sm text-green-700 font-medium mb-1">평균 성공률</p>
          <p className="text-3xl font-bold text-green-900">{stats.successRate}%</p>
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 방문자 추이 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">방문자 추이</h3>
              <p className="text-sm text-gray-500 mt-1">
                {period === 'week' ? '최근 7일간' : '최근 6개월'} 방문자 수
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-people text-blue-600 text-lg"></i>
            </div>
          </div>
          <ReactApexChart
            options={visitorChartOptions}
            series={visitorChartSeries}
            type="area"
            height={350}
          />
        </div>

        {/* 펀딩 금액 추이 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">펀딩 금액 추이</h3>
              <p className="text-sm text-gray-500 mt-1">
                {period === 'week' ? '최근 7일간' : '최근 6개월'} 펀딩 금액
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-cash-stack text-purple-600 text-lg"></i>
            </div>
          </div>
          <ReactApexChart
            options={fundingChartOptions}
            series={fundingChartSeries}
            type="bar"
            height={350}
          />
        </div>

        {/* 카테고리별 프로젝트 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">카테고리별 프로젝트</h3>
              <p className="text-sm text-gray-500 mt-1">카테고리별 프로젝트 분포</p>
            </div>
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-pie-chart text-pink-600 text-lg"></i>
            </div>
          </div>
          <ReactApexChart
            options={categoryChartOptions}
            series={categoryProjects.series}
            type="donut"
            height={320}
          />
        </div>

        {/* 성공률 추이 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">성공률 추이</h3>
              <p className="text-sm text-gray-500 mt-1">월별 프로젝트 성공률</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-graph-up-arrow text-green-600 text-lg"></i>
            </div>
          </div>
          <ReactApexChart
            options={successRateChartOptions}
            series={successRateChartSeries}
            type="line"
            height={320}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
