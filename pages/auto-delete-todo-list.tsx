import { mockTodoList } from '@components/utils/mocks/todoList'
import { useCallback, useState } from 'react'

interface todoListType {
  type: string
  name: string
  deleteProcess?: NodeJS.Timeout
}

interface inProgressByType {
  [type: string]: todoListType[]
}

export default function AutoDeleteTodoListPage() {
  const [todoList, setTodoList] = useState<todoListType[]>(mockTodoList)
  const [inProgressByType, setInProgressByType] = useState<inProgressByType>(() => {
    const uniqueTypeList = [...new Set(mockTodoList.map(({ type }) => type))]
    const newObj: inProgressByType = {}
    uniqueTypeList.forEach((item) => {
      newObj[item] = []
    })
    return newObj
  })

  const returnToTodoList = useCallback((todo: todoListType, knownIndex?: number) => {
    setTodoList((prevState) => [...prevState, todo])
    setInProgressByType((curVal) => {
      curVal[todo.type].splice(knownIndex ?? curVal[todo.type].indexOf(todo), 1)
      return { ...curVal }
    })
  }, [])

  const autoBackToTodoList = useCallback((todo: todoListType): NodeJS.Timeout => {
    const deleyTime = 5000 // 5 sec
    return setTimeout(() => returnToTodoList(todo), deleyTime)
  }, [])

  const handleClickTodoItem = useCallback(
    (todo: todoListType, clickIndex: number) => {
      const autoDeleteProcess = autoBackToTodoList(todo)
      todo.deleteProcess = autoDeleteProcess
      inProgressByType[todo.type].push(todo)
      setInProgressByType({ ...inProgressByType })

      todoList.splice(clickIndex, 1)
      setTodoList([...todoList])
    },
    [inProgressByType, todoList],
  )

  const handleClickInProgressItem = useCallback((todo: todoListType, type: string, clickIndex: number) => {
    clearTimeout(todo.deleteProcess)
    returnToTodoList(todo, clickIndex)
  }, [])

  return (
    <div className="px-7 py-5">
      <div className="flex flex-row gap-7">
        <div className="flex min-w-[300px] flex-col gap-3">
          {todoList.map((todo, index) => (
            <button
              key={index}
              className="flex h-12 w-full flex-row items-center justify-center border-2 border-gray-200 text-lg font-medium shadow-sm"
              onClick={() => handleClickTodoItem(todo, index)}
            >
              {todo.name}
            </button>
          ))}
        </div>

        <div className="flex flex-row gap-3">
          {Object.keys(inProgressByType).map((key, index) => (
            <div
              key={index}
              className="flex min-h-[calc(100dvh-40px)] w-[300px] flex-col border-2 border-gray-200 shadow-sm"
            >
              <div className="flex justify-center border-b-2 border-gray-200 bg-slate-100 p-1.5 text-center text-xl font-semibold">
                {key}
              </div>

              <div className="flex flex-col gap-3 p-3">
                {inProgressByType[key].map((todo, index) => (
                  <button
                    key={index}
                    className="flex h-12 w-full flex-row items-center justify-center border-2 border-gray-200 text-lg font-medium shadow-sm"
                    onClick={() => handleClickInProgressItem(todo, key, index)}
                  >
                    {todo.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
