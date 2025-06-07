import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../AxiosInstance'

const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'
//UUID로 변경해야함
const customerKey = 'WktkPiB0IJh6oI3BhywyI'

/*
export function CheckoutPage() {
	const [amount, setAmount] = useState({
		currency: 'KRW',
		value: 50_000,
	})
	const [ready, setReady] = useState(false)
	const [widgets, setWidgets] = useState(null)

	useEffect(() => {
		async function fetchPaymentWidgets() {
			// ------  결제위젯 초기화 ------
			const tossPayments = await loadTossPayments(clientKey)
			// 회원 결제
			const widgets = tossPayments.widgets({
				customerKey,
			})
			// 비회원 결제
			// const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

			setWidgets(widgets)
		}

		fetchPaymentWidgets()
	}, [clientKey, customerKey])

	useEffect(() => {
		async function renderPaymentWidgets() {
			if (widgets == null) {
				return
			}
			// ------ 주문의 결제 금액 설정 ------
			await widgets.setAmount(amount)

			await Promise.all([
				// ------  결제 UI 렌더링 ------
				widgets.renderPaymentMethods({
					selector: '#payment-method',
					variantKey: 'DEFAULT',
				}),
				// ------  이용약관 UI 렌더링 ------
				widgets.renderAgreement({
					selector: '#agreement',
					variantKey: 'AGREEMENT',
				}),
			])

			setReady(true)
		}

		renderPaymentWidgets()
	}, [widgets])

	useEffect(() => {
		if (widgets == null) {
			return
		}

		widgets.setAmount(amount)
	}, [widgets, amount])

	return (
		<div className='wrapper'>
			<div className='box_section'>
				<div id='payment-method' />
				<div id='agreement' />

				<button
					className='button'
					disabled={!ready}
					onClick={async () => {
						try {
							// ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
							// 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
							// 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
							await widgets.requestPayment({
								orderId: '8wuWeKf0CqH61-veognNt',
								orderName: '토스 티셔츠 외 2건',
								successUrl: window.location.origin + '/success',
								failUrl: window.location.origin + '/fail',
								customerEmail: 'customer123@gmail.com',
								customerName: '김토스',
								customerMobilePhone: '01012341234',
							})
						} catch (error) {
							// 에러 처리하기
							console.error(error)
						}
					}}>
					결제하기
				</button>
			</div>
		</div>
	)
}
*/

export function PopupPaymentPage() {
  const [searchParams] = useSearchParams()
  const amount = Number(searchParams.get('amount'))
const [payAmount, setPayAmount] = useState({
  currency: "KRW",
  value: amount,
});
const [ready, setReady] = useState(false);
const [widgets, setWidgets] = useState(null);

useEffect(() => {
  async function fetchPaymentWidgets() {
    // ------  결제위젯 초기화 ------
    const tossPayments = await loadTossPayments(clientKey);
    // 회원 결제
    const widgets = tossPayments.widgets({
      customerKey,
    });
    // 비회원 결제
    // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

    setWidgets(widgets);
  }

  fetchPaymentWidgets();
}, [clientKey, customerKey]);

useEffect(() => {
  async function renderPaymentWidgets() {
    if (widgets == null) {
      return;
    }
    // ------ 주문의 결제 금액 설정 ------
    await widgets.setAmount(payAmount);

    await Promise.all([
      // ------  결제 UI 렌더링 ------
      widgets.renderPaymentMethods({
        selector: "#payment-method",
        variantKey: "DEFAULT",
      }),
      // ------  이용약관 UI 렌더링 ------
      widgets.renderAgreement({
        selector: "#agreement",
        variantKey: "AGREEMENT",
      }),
    ]);

    setReady(true);
  }

  renderPaymentWidgets();
}, [widgets]);

useEffect(() => {
  if (widgets == null) {
    return;
  }

  widgets.setAmount(payAmount);
}, [widgets, payAmount]);

return (
  <div className="wrapper">
    <div className="box_section">
      {/* 결제 UI */}
      <div id="payment-method" />
      {/* 이용약관 UI */}
      <div id="agreement" />

      {/* 결제하기 버튼 */}
      <button
        className="button"
        disabled={!ready}
        onClick={async () => {
          try {
            // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
            // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
            // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
            await widgets.requestPayment({
              orderId: 'ORDER_' + new Date().getTime(),
              orderName: "포인트 충전",
              successUrl: window.location.origin + "/popup-payment-success",
              failUrl: window.location.origin + "/fail",
              customerEmail: "customer123@gmail.com",
              customerName: "김토스",
              customerMobilePhone: "01012341234",
            });
          } catch (error) {
            // 에러 처리하기
            console.error(error);
          }
        }}
      >
        결제하기
      </button>
    </div>
  </div>
);
}

export function SuccessPage() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const didConfirm = useRef(false)

	useEffect(() => {
		// 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
		// 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
		const requestData = {
			orderId: searchParams.get('orderId'),
			amount: searchParams.get('amount'),
			paymentKey: searchParams.get('paymentKey'),
		}

		async function confirm() {
			// 개발 환경에서 요청 한번만 보내도록 설정
			if (didConfirm.current) return
			didConfirm.current = true

			const response = await api.get(`/payment/toss/approve?orderId=${requestData.orderId}&paymentKey=${requestData.paymentKey}&amount=${requestData.amount}`, {
				headers: {
					'Content-Type': 'application/json',
				},
			})

			const json = await response.data

			if (!response.status || response.status >= 400) {
				// 결제 실패 비즈니스 로직을 구현하세요.
				navigate(`/fail?message=${json.message}&code=${json.code}`)
				return
			}

			// 결제 성공 비즈니스 로직을 구현하세요.
			const timeout = setTimeout(() => {
				if (window.opener && !window.opener.closed) {
					window.close()
				}
			}, 500)

			return () => clearTimeout(timeout)
		}
		confirm()
	}, [])

	return (
		<div className='result wrapper'>
			<div className='box_section'>
				<h2>결제 성공</h2>
				<p>{`주문번호: ${searchParams.get('orderId')}`}</p>
				<p>{`결제 금액: ${Number(searchParams.get('amount')).toLocaleString()}원`}</p>
				<p>{`paymentKey: ${searchParams.get('paymentKey')}`}</p>
			</div>
		</div>
	)
}

export function FailPage() {
	const [searchParams] = useSearchParams()

	return (
		<div className='result wrapper'>
			<div className='box_section'>
				<h2>결제 실패</h2>
				<p>{`에러 코드: ${searchParams.get('code')}`}</p>
				<p>{`실패 사유: ${searchParams.get('message')}`}</p>
			</div>
		</div>
	)
}
