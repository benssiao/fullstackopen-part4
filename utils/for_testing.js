const reverse = (string) => {
    return string
      .split('')
      .reverse()
      .join('')
  }
  

function average(array) {
    if (array.length === 0) {
        return 0;
    }
    const sum = array.reduce((sum, curr) => {
        return sum + curr;
    }, 0)
    return sum/array.length
}


module.exports = {
    reverse, 
    average,
}