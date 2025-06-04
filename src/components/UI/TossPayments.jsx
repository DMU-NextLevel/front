import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk"
import { useEffect, useState } from "react";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "WktkPiB0IJh6oI3BhywyI";

export const CheckoutPage = () => {
    const [amount, setAmount] = useState({ currency: "KRW", value: 50_000})
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
}