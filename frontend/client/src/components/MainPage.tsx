import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {increment, decrement} from '../features/CounterSlice'
import {MainHeader} from './inc/MainHeader'

const MainPage = function () {
    const count = useSelector((state:any) => state.counter.value)
    const dispatch = useDispatch()
    return (
        <div>
            <MainHeader></MainHeader>
            Main
            <span>{count}</span>
            <button onClick={() => {dispatch(increment())}}>+1</button>
            <button onClick={() => {dispatch(decrement())}}>-1</button>
        </div>
    )
}

export default MainPage