import React from 'react'

export default function Popular({ onChildValue, sortedCategories, starredCategories, currentCategory, isStarred }) {

  function ListItem({ value }) {

    const handleClick = () => {
      onChildValue(value)
    }

    return <li onClick={handleClick}>{value}</li>
  }


  function displayCategories() {
    let combinedCategories = []
    if (isStarred) {
      combinedCategories = [...starredCategories, ...sortedCategories];

    }
    else {
      combinedCategories = [...sortedCategories]
    }

    const uniqueCategories = [...new Set(combinedCategories)]

    const categoriesToDisplay = uniqueCategories.slice(0, 10);

    return categoriesToDisplay
  }

  return (
    <div className='popular'>
      {
        isStarred ? <h1>
          Your favorite topics..
        </h1> :
          <h1>What’s popular right now?</h1>
      }

      <div className='list'>
        {sortedCategories.length > 0 ? (
          <ul className='list-items'>
            {displayCategories().map((category) => (
              <ListItem key={category} value={category} />
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
}
