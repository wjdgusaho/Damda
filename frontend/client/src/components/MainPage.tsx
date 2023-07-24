import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement } from '../features/CounterSlice'
import { MainHeader } from './inc/MainHeader'
import { styled } from 'styled-components'

/*
1. 모든 타임캡슐의 조건 만족 여부와 밑의 3가지 경우로 나뉨.
2. 클래식(생성날짜, 만료날짜, 이름, 현재 용량, 최대 용량) 
3. 기록(생성날짜, 만료날짜, 이름, 현재 용량, 최대 용량)
4. 목표(달성률[백에서 계산해서 전송], 이름, 현재 용량, 최대 용량)
*/
const capsuleList = [
    {
        id: 1,
        type: 'classic',
        sDate: '2023-01-01',
        eDate: '2024-01-01',
        name: '클래식1',
        imgsrc: 'assets/Planet-6.png',
    },
    // {
    //     id:2,
    //     type: 'goal',
    //     sDate: '2022-01-01',
    //     eDate: '2023-01-01',
    //     name: '목표1',
    //     imgsrc: 'assets/Planet-2.png',
    // },
    // {
    //     id:3,
    //     type: 'memory',
    //     sDate: '2022-01-01',
    //     eDate: '2023-01-01',
    //     name: '기록1',
    //     imgsrc: 'assets/Planet-3.png',
    // },

];

const MainPage = function () {
    const count = useSelector((state: any) => state.counter.value)
    const dispatch = useDispatch()
    return (
        <div>
            <MainHeader></MainHeader>
            <div className='mt-12'>
                {capsuleList.map(c => (
                    <Capsule className='text-center'>
                        <Dday className='m-auto'>
                            D - {calculateDateDifference(c.sDate, c.eDate)}
                        </Dday>
                        <ProgressBar percentage={calculateProgressPercentage(c.sDate, c.eDate)}></ProgressBar>
                        <FloatingImage className='h-52 m-auto mt-20' src={c.imgsrc} alt="" />
                        <CapsuleShadow className='m-auto mt-2'></CapsuleShadow>
                    </Capsule>
                ))}
            </div>
            <div className='text-center mt-8'>
                <MakeCapsuleButton className='bg-lilac-100 w-64 h-16 flex items-center justify-center m-auto text-lilac-950 hover:bg-lilac-500'>타임캡슐 만들기</MakeCapsuleButton>
                <MakeCapsuleCode className='mt-4 hover:text-lilac-900'>타임캡슐 코드로 참여하기</MakeCapsuleCode>
            </div>

        </div>
    )
}
const ProgressBar = ({ percentage }: ProgressBarProps) => {
    return (
        <ProgressContainer className='m-auto mt-3'>
            <Progress style={{ width: `${percentage}%` }}></Progress>
        </ProgressContainer>
    );
};

const MakeCapsuleButton = styled.div`
    border-radius: 30px;
    font-family: 'pretendard';
    font-size: 20px;
    font-weight: 400;
    box-shadow: 0px 4px 4px #534177;

    &:hover{
        transition: 0.2s;
        transform: scale(0.95);
    }
`;
const MakeCapsuleCode = styled.div`
    border-radius: 30px;
    font-family: 'pretendard';
    font-size: 18px;
    font-weight: 200;
    color: #ffffff;
    text-decoration-line: underline;
`;

const FloatingImage = styled.img`
  /* 기본 위치를 설정합니다. */
  position: relative;
  top: 0;

  /* 애니메이션을 정의합니다. */
  @keyframes floatingAnimation {
    0% {
      transform: translateY(0); /* 시작 위치 (위치 이동 없음) */
    }
    50% {
      transform: translateY(-10px); /* 위로 10px 이동 */
    }
    100% {
      transform: translateY(0); /* 다시 원래 위치로 이동 */
    }
  }

  /* 애니메이션을 적용합니다. */
  animation: floatingAnimation 2s ease infinite;
`;

const Dday = styled.div`
    font-family: 'PyeongChangPeaceBold';
    background: linear-gradient(90deg, #A247C1 -19.12%, #FFB86C 117.65%);
    background-clip: text; /* 텍스트 색상을 배경에 맞추기 위해 설정 */
    -webkit-background-clip: text; /* 크로스 브라우저 지원을 위해 -webkit- 접두사 사용 (일부 브라우저에 필요) */
    color: transparent; /* 텍스트 색상을 투명하게 설정 */
    font-size: 40px;
    width: 200px;
  `;

const ProgressContainer = styled.div`
  height: 15px;
  background-color: #EFE0F4;
  border-radius: 10px;
  overflow: hidden;
  width: 200px;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  `;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #A247C1 -19.12%, #FFB86C 117.65%);
  border-radius: 10px;
  transition: width 3s;
  border: 2px solid #ded1e3;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  `;


const Capsule = styled.div`
    font-family: 'pretendard';
    font-weight: 300;
    color: aliceblue;
    `;

const CapsuleShadow = styled.div`
    width: 205px;
    height: 78px;
    border-radius: 50%;
    background: #513A71;
    filter: blur(5px);
  `;


interface ProgressBarProps {
    percentage: number;
}

const calculateDateDifference = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convert milliseconds to days
    return differenceInDays;
};
const calculateProgressPercentage = (startDate: string, endDate: string) => {
    const total = calculateDateDifference(startDate, endDate);
    const currentDate = new Date();
    const dateString = currentDate.toISOString().slice(0, 10);
    const ratio = calculateDateDifference(startDate, dateString);
    return (ratio / total) * 100;
};

export default MainPage