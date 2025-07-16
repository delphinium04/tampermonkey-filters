// ==UserScript==
// @name         Quasarzone 닉네임 필터링
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  저장된 닉네임 목록을 기반으로 tr 제거
// @author       Delphinium04
// @match        *quasarzone.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "zod-filteredNicks";

    // 닉네임 편집용 단축키: Shift + F2
    window.addEventListener('keydown', async (e) => {
        if (e.shiftKey && e.key === 'F2') {
            e.preventDefault();
            let current = await GM_getValue(STORAGE_KEY, "");
            let input = prompt("제외할 닉네임을 쉼표로 입력해주세요", current);
            if (input !== null) {
                await GM_setValue(STORAGE_KEY, input);
                alert("닉네임 목록이 저장되었습니다. 새로 고침하면 적용됩니다.");
            }
        }
    });

    // 닉네임 필터링 함수
    async function filterRows() {
        let nickCSV = await GM_getValue(STORAGE_KEY, "");
        if (!nickCSV) return;

        const nickList = nickCSV.split(',').map(n => n.trim()).filter(n => n);
        if (nickList.length === 0) return;

        const parentDiv = document.querySelector('.market-type-list.market-info-type-list.relative');
        if (!parentDiv) return;

        const rows = parentDiv.querySelectorAll('tr');
        rows.forEach(tr => {
            const nickSpan = tr.querySelector('.user-nick-wrap.nick[data-nick]');
            if (!nickSpan) return;
            const nick = nickSpan.getAttribute('data-nick');
            if (nickList.includes(nick)) {
                tr.remove();
            }
        });
    }

    // DOM 로딩 이후 필터 실행
    window.addEventListener('load', () => {
        filterRows(); // 필요시 delay 조정
    });
})();
