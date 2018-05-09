// 迭代器

// 返回一个迭代器对象,通过闭包
function makeIterator(arr) {
  let nextIndex = 0
  return {
    next: () => {
      // next方法返回的结果对象
      if (nextIndex < arr.length) {
        return {
          value: arr[nextIndex++],
          done: false
        }
      } else {
        return {
          done: true
        }
      }
    }
  }
}

// genent对象，通过yiled来断点执行
function* makeIterator(arr) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i];
  }
}
const gen = makeIterator(['吃饭', '睡觉', '打豆豆'])