// ==UserScript==
// @name         Zod 게시판 닉네임 필터링
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  특정 닉네임이 포함된 게시글 li 제거
// @author       Delphinium04
// @match        *zod.kr/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'q-app_board_filtered_nicks';

    // Shift + F2로 닉네임 설정
    window.addEventListener('keydown', async (e) => {
        if (e.shiftKey && e.key === 'F2') {
            const current = await GM_getValue(STORAGE_KEY, '');
            const input = prompt('제외할 닉네임을 쉼표로 입력하세요:', current);
            if (input !== null) {
                await GM_setValue(STORAGE_KEY, input);
                alert('닉네임이 저장되었습니다. 새로고침 후 적용됩니다.');
            }
        }
    });

    async function performFiltering() {
        const rawList = await GM_getValue(STORAGE_KEY, '');
        if (!rawList.trim()) return;

        const blockList = rawList.split(',').map(n => n.trim()).filter(n => n.length > 0);
        if (blockList.length === 0) return;

        // class에 app-board-template-list가 포함된 ul 찾기
        const targetUl = document.querySelector('ul[class*="app-board-template-list"]');
        if (!targetUl) return;

        const liList = targetUl.querySelectorAll('li');
        liList.forEach(li => {
            const memberDiv = li.querySelector('.app-list-member');
            if (memberDiv) {
                const memberText = memberDiv.textContent.trim();
                if (blockList.some(nick => memberText.includes(nick))) {
                    li.remove(); // 닉네임 포함 -> li 제거
                }
            }
        });
    }

    // DOM이 준비되면 실행
    window.addEventListener('load', () => {
        performFiltering(); // 필요시 delay 조정
    });
})();
