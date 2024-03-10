export function formattedDate(dateTimeString) {
    const dateTimeParts = dateTimeString.split('-')

    const day = dateTimeParts[0]
    const month = dateTimeParts[1]
    const year = dateTimeParts[2]

    return `${day}-${month}-${year}`

  }

  export function formattedDate2(dateTimeString) {
    const dateTimeParts = dateTimeString.split('-')

    const day = dateTimeParts[0]
    const month = dateTimeParts[1]
    const year = dateTimeParts[2]

    return `${month}-${day}-${year}`

  }

  export function formattedTime(dateTimeString) {
    const dateTimeParts = dateTimeString.split('-')

    const hours = dateTimeParts[3]
    const minutes = dateTimeParts[4]
    const seconds = dateTimeParts[5]

    return `${hours}-${minutes}-${seconds}`

  }

 export  function getCurrentDateTime() {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = String(now.getFullYear())
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`
  }