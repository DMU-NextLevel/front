export interface FAQItem {
  id: number
  category: string
  question: string
  answer: string
  icon: string
}

export const FAQ_CATEGORIES = [
  '회원가입 및 계정 관리',
  '펀딩 프로젝트 이용',
  '프로젝트 창작자',
  '결제 및 환불'
]

export const FAQ_DATA: FAQItem[] = [
  // 회원가입 및 계정 관리
  {
    id: 1,
    category: '회원가입 및 계정 관리',
    question: 'WithU에 어떻게 가입하나요?',
    answer: 'WithU는 이메일 가입과 소셜 로그인(구글, 카카오) 두 가지 방식을 모두 지원합니다. 원하는 방식을 선택하여 가입하실 수 있습니다.',
    icon: 'bi-person-circle'
  },
  {
    id: 2,
    category: '회원가입 및 계정 관리',
    question: '이메일로 가입했는데, 이메일 인증이 필요한가요?',
    answer: '네, 이메일 가입 시에는 회원님의 정보 보호를 위해 가입 시 입력하신 이메일로 인증 메일을 보내드립니다. 메일의 링크를 클릭하여 인증을 완료해야 정상적으로 서비스를 이용할 수 있습니다.',
    icon: 'bi-envelope-check'
  },
  {
    id: 3,
    category: '회원가입 및 계정 관리',
    question: '비밀번호를 잊어버렸어요.',
    answer: '이메일 가입 회원은 로그인 페이지 > 비밀번호 찾기를 통해 비밀번호를 재설정할 수 있습니다. 소셜 로그인 회원은 해당 소셜 계정의 비밀번호 찾기 기능을 이용하시면 됩니다.',
    icon: 'bi-key'
  },
  {
    id: 4,
    category: '회원가입 및 계정 관리',
    question: '계정을 삭제하고 싶어요.',
    answer: '마이페이지 > 설정 > 계정 관리에서 회원 탈퇴가 가능합니다. 탈퇴 시 모든 개인정보가 즉시 삭제되며, 진행 중인 펀딩이 있는 경우 탈퇴가 제한될 수 있습니다.',
    icon: 'bi-person-x'
  },
  {
    id: 5,
    category: '회원가입 및 계정 관리',
    question: '소셜 로그인과 이메일 계정을 연동할 수 있나요?',
    answer: '현재는 계정 연동 기능을 제공하지 않습니다. 각 로그인 방식은 독립적인 계정으로 관리됩니다.',
    icon: 'bi-link-45deg'
  },
  {
    id: 6,
    category: '회원가입 및 계정 관리',
    question: '프로필 정보를 수정하고 싶어요.',
    answer: '마이페이지에서 프로필 사진, 닉네임, 소개 등을 자유롭게 수정할 수 있습니다. 변경된 정보는 즉시 반영됩니다.',
    icon: 'bi-pencil-square'
  },

  // 펀딩 프로젝트 이용
  {
    id: 7,
    category: '펀딩 프로젝트 이용',
    question: '펀딩은 어떻게 참여하나요?',
    answer: '관심 있는 프로젝트를 선택하고 리워드를 고른 후 결제하시면 펀딩 참여가 완료됩니다. 프로젝트가 목표 금액을 달성하면 리워드를 받으실 수 있습니다.',
    icon: 'bi-heart-fill'
  },
  {
    id: 8,
    category: '펀딩 프로젝트 이용',
    question: '펀딩 후 취소나 변경이 가능한가요?',
    answer: '프로젝트 진행 중에는 마이페이지 > 펀딩 내역에서 취소 및 리워드 변경이 가능합니다. 단, 프로젝트 종료 후에는 변경이 불가능합니다.',
    icon: 'bi-arrow-repeat'
  },
  {
    id: 9,
    category: '펀딩 프로젝트 이용',
    question: '목표 금액을 달성하지 못하면 어떻게 되나요?',
    answer: 'WithU는 All or Nothing 방식을 채택하고 있습니다. 목표 금액 미달성 시 결제가 진행되지 않으며, 승인된 금액은 자동으로 취소됩니다.',
    icon: 'bi-exclamation-triangle'
  },
  {
    id: 10,
    category: '펀딩 프로젝트 이용',
    question: '리워드는 언제 받을 수 있나요?',
    answer: '각 프로젝트마다 예상 배송일이 다릅니다. 프로젝트 페이지에서 리워드별 배송 예정일을 확인하실 수 있으며, 배송이 시작되면 알림을 보내드립니다.',
    icon: 'bi-gift'
  },
  {
    id: 11,
    category: '펀딩 프로젝트 이용',
    question: '좋아요와 알림 설정은 어떻게 하나요?',
    answer: '프로젝트 페이지에서 하트 아이콘을 클릭하면 좋아요 및 알림 설정이 가능합니다. 프로젝트의 중요 소식을 알림으로 받아보실 수 있습니다.',
    icon: 'bi-bell'
  },
  {
    id: 12,
    category: '펀딩 프로젝트 이용',
    question: '프로젝트 진행 상황은 어디서 확인하나요?',
    answer: '펀딩에 참여한 프로젝트는 마이페이지 > 펀딩 내역에서 진행 상황을 실시간으로 확인할 수 있습니다. 창작자가 올린 업데이트도 함께 볼 수 있습니다.',
    icon: 'bi-graph-up'
  },

  // 프로젝트 창작자
  {
    id: 13,
    category: '프로젝트 창작자',
    question: '프로젝트를 시작하려면 어떻게 해야 하나요?',
    answer: '상단 메뉴의 "프로젝트 시작하기"를 클릭하면 프로젝트 생성 페이지로 이동합니다. 프로젝트 정보, 스토리, 리워드 등을 입력하고 심사를 신청하시면 됩니다.',
    icon: 'bi-rocket-takeoff'
  },
  {
    id: 14,
    category: '프로젝트 창작자',
    question: '프로젝트 심사는 얼마나 걸리나요?',
    answer: '심사는 보통 3~5 영업일 소요됩니다. 심사 결과는 이메일과 알림으로 안내드리며, 보완이 필요한 경우 상세한 피드백을 제공합니다.',
    icon: 'bi-clock-history'
  },
  {
    id: 15,
    category: '프로젝트 창작자',
    question: '수수료는 어떻게 되나요?',
    answer: 'WithU는 프로젝트 성공 시 모금액의 5%를 플랫폼 수수료로 책정하고 있습니다. 별도의 결제 수수료는 PG사 정책에 따릅니다.',
    icon: 'bi-percent'
  },
  {
    id: 16,
    category: '프로젝트 창작자',
    question: '펀딩 금액은 언제 정산되나요?',
    answer: '프로젝트 종료 후 7~10 영업일 내에 등록하신 계좌로 정산됩니다. 정산 내역은 창작자 대시보드에서 확인 가능합니다.',
    icon: 'bi-cash-coin'
  },
  {
    id: 17,
    category: '프로젝트 창작자',
    question: '프로젝트 진행 중 내용을 수정할 수 있나요?',
    answer: '펀딩 시작 후에는 중요 정보(리워드, 금액 등) 변경이 제한됩니다. 단, 창작자 노트를 통해 서포터들에게 업데이트 소식을 전할 수 있습니다.',
    icon: 'bi-pencil'
  },
  {
    id: 18,
    category: '프로젝트 창작자',
    question: '서포터와 소통하는 방법이 있나요?',
    answer: '창작자 노트, 댓글 답변, 개별 메시지 등 다양한 소통 채널을 제공합니다. 적극적인 소통은 프로젝트 성공률을 높이는 중요한 요소입니다.',
    icon: 'bi-chat-dots'
  },

  // 결제 및 환불
  {
    id: 19,
    category: '결제 및 환불',
    question: '어떤 결제 수단을 사용할 수 있나요?',
    answer: '신용카드, 체크카드, 계좌이체, 간편결제(카카오페이, 네이버페이 등), WithU 포인트를 사용하실 수 있습니다.',
    icon: 'bi-credit-card'
  },
  {
    id: 20,
    category: '결제 및 환불',
    question: '결제 실패 시 어떻게 해야 하나요?',
    answer: '결제 한도 초과, 카드 정보 오류 등이 원인일 수 있습니다. 다른 결제 수단을 시도하거나 카드사에 문의해 주세요. 문제가 지속되면 고객센터로 연락 부탁드립니다.',
    icon: 'bi-exclamation-circle'
  },
  {
    id: 21,
    category: '결제 및 환불',
    question: '환불은 어떻게 받나요?',
    answer: '프로젝트 진행 중 취소 시에는 결제 승인만 취소됩니다. 프로젝트 종료 후에는 창작자와 협의하여 환불을 진행하게 됩니다.',
    icon: 'bi-arrow-counterclockwise'
  },
  {
    id: 22,
    category: '결제 및 환불',
    question: 'WithU 포인트는 어떻게 사용하나요?',
    answer: '펀딩 결제 시 포인트를 사용할 수 있으며, 1포인트는 1원으로 사용됩니다. 마이페이지에서 보유 포인트와 사용 내역을 확인하실 수 있습니다.',
    icon: 'bi-coin'
  },
  {
    id: 23,
    category: '결제 및 환불',
    question: '영수증이나 세금계산서 발급이 가능한가요?',
    answer: '마이페이지 > 펀딩 내역에서 현금영수증 및 세금계산서를 신청하실 수 있습니다. 프로젝트 종료 후 발급 가능합니다.',
    icon: 'bi-file-earmark-text'
  },
  {
    id: 24,
    category: '결제 및 환불',
    question: '분할 결제가 가능한가요?',
    answer: '신용카드 결제 시 카드사의 무이자 할부 혜택을 이용하실 수 있습니다. 할부 개월 수는 카드사 및 프로모션에 따라 다릅니다.',
    icon: 'bi-calendar-check'
  }
]

export const CATEGORY_ICONS: { [key: string]: string } = {
  '회원가입 및 계정 관리': 'bi-person-circle',
  '펀딩 프로젝트 이용': 'bi-heart-fill',
  '프로젝트 창작자': 'bi-rocket-takeoff',
  '결제 및 환불': 'bi-credit-card'
}
