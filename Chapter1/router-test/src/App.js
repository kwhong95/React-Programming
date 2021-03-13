import React from 'react';
import {Route, Link, BrowserRouter} from 'react-router-dom';
import { Rooms }from './Rooms.js';

export default function App() {
    return (
        <BrowserRouter>
            <div style={{ padding: 20, border: '5px solid gray'}}>
                <Link to='/'>홈</Link>
                <br />
                <Link to='/photo'>사진</Link>
                <br />
                <Link to='/rooms'>방 소개</Link>
                <br />
                <Route exact path='/' component={Home} />
                <Route path='/photo' component={Photo} />
                <Route path='/rooms' component={Rooms} />
            </div>
        </BrowserRouter>
    )
}

function Home() {
    return <h2>홈페이지 > 원하는 페이지 버튼을 클릭하시오.</h2>
}
function Photo() {
    return <h2>여기서 사진을 감상하시오.</h2>
}