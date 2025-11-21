document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.getElementById('calendarGrid');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const exchangeForm = document.getElementById('exchangeForm');
    
    let selectedDates = []; // 선택된 날짜 저장 (최대 2개)

    // 간단한 5월 달력 렌더링 (예시: 1일이 월요일이라고 가정)
    const totalDays = 31;
    const startDayIndex = 1; // 0:일, 1:월 ...

    function renderCalendar() {
        calendarGrid.innerHTML = '';

        // 빈 칸 채우기
        for (let i = 0; i < startDayIndex; i++) {
            const emptyDiv = document.createElement('div');
            calendarGrid.appendChild(emptyDiv);
        }

        // 날짜 생성
        for (let d = 1; d <= totalDays; d++) {
            const dateEl = document.createElement('div');
            dateEl.classList.add('date-item');
            dateEl.textContent = d;
            dateEl.dataset.day = d;
            
            // 클릭 이벤트 추가
            dateEl.addEventListener('click', () => handleDateClick(d, dateEl));
            calendarGrid.appendChild(dateEl);
        }
    }

    function handleDateClick(day, element) {
        // 이미 선택된 날짜가 2개면 초기화 후 다시 선택
        if (selectedDates.length === 2) {
            resetSelection();
            selectedDates.push(day);
        } else if (selectedDates.length === 1) {
            // 두 번째 날짜 선택 (범위 설정)
            if (day < selectedDates[0]) {
                selectedDates.unshift(day); // 더 이전 날짜면 앞에 추가
            } else {
                selectedDates.push(day);
            }
        } else {
            // 첫 번째 날짜 선택
            selectedDates.push(day);
        }

        updateCalendarUI();
        updateInputFields();
    }

    function resetSelection() {
        selectedDates = [];
        const allDates = document.querySelectorAll('.date-item');
        allDates.forEach(el => {
            el.classList.remove('selected', 'in-range', 'range-start', 'range-end');
        });
    }

    function updateCalendarUI() {
        const allDates = document.querySelectorAll('.date-item');
        
        allDates.forEach(el => {
            const day = parseInt(el.dataset.day);
            el.classList.remove('selected', 'in-range', 'range-start', 'range-end');

            if (selectedDates.includes(day)) {
                el.classList.add('selected');
            }

            // 범위 색칠 로직
            if (selectedDates.length === 2) {
                if (day > selectedDates[0] && day < selectedDates[1]) {
                    el.classList.add('in-range');
                }
                if (day === selectedDates[0]) el.classList.add('range-start');
                if (day === selectedDates[1]) el.classList.add('range-end');
            }
        });
    }

    function updateInputFields() {
        if (selectedDates.length > 0) {
            startDateInput.value = `5월 ${selectedDates[0]}일`;
        }
        if (selectedDates.length === 2) {
            endDateInput.value = `5월 ${selectedDates[1]}일`;
        } else {
            endDateInput.value = '';
        }
    }

    // 폼 제출 처리
    exchangeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bookTitle = document.getElementById('bookTitle').value;
        const memberCount = document.getElementById('memberCount').value;

        if(!bookTitle || !memberCount || selectedDates.length < 2) {
            alert('모든 정보를 입력하고 기간을 설정해주세요.');
            return;
        }

        // 데이터를 저장하고 결과 페이지로 이동 (URL 파라미터 방식)
        const queryParams = new URLSearchParams({
            book: bookTitle,
            count: memberCount,
            start: startDateInput.value,
            end: endDateInput.value
        }).toString();

        window.location.href = `result.html?${queryParams}`;
    });

    // 초기화 실행
    renderCalendar();
});