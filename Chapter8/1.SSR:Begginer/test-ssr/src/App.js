import React, { useState, useEffect } from 'react';
import Home from './Home';
import About from './About';

export default function App({ page }) {
    const [page, setPage] = useState(page);
    useEffect(() => {
        // 단일 페이지 애플리케이션 직접 구현
        window.onpopstate = event => { // 브라우저 뒤로 가기 버튼 클릭 시 onpopstate 함수 호출
            setPage(event.state);
        };
    }, []);

    // 특정 페이지로 이동하는 버튼의 이벤트 처리 함수
    function onChangePage(e) {
        const newPage = e.taget.dataset.page;
        // pushState 메서드를 통해 브라우저에게 주소의 변경됨을 알림
        window.history.pushState(newPage, '', `${newPage}`);
        setPage(newPage);
    }
    // page 상태값에 따라 렌더링할 페이지의 컴포넌트가 결정
    const PageComponent = page === 'home' ? Home : About;
    return (
        <div className="container">
            <button data-page='home' onClick={onChangePage}>
                Home
            </button>
            <button data-page='about' onClick={onChangePage}>
                About
            </button>
            <PageComponent />
        </div>
    );
}