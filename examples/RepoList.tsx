import * as React from 'react'
import useRepos from './resources/useRepos'
import useUsers from './resources/useUsers'

const List: React.FC<any> = () => {
  const [
    repos,
    { handleCreate, handleDelete, createStatus, deleteStatus }
  ] = useRepos()
  const [users] = useUsers()
  const mergedRepos = repos.map(repo => {
    const user = users.find(_ => _.id === repo.creatorId)
    return {
      ...repo,
      userName: user ? user.name : 'N/A'
    }
  })

  return (
    <>
      <div>
        {mergedRepos.map(_ => (
          <div>
            <span key={_.id}>
              {_.id}: {_.name} Created By {_.userName}
            </span>
            &nbsp;
            {deleteStatus.processing && <span>Loading....</span>}
            <button onClick={() => handleDelete(_.id)}>Delete</button>
          </div>
        ))}
        {createStatus.processing && <span>Loading....</span>}
      </div>
      <button onClick={() => handleCreate({} as any)}>Create</button>
    </>
  )
}

export default List

const root = (
  <div key="a1">
    <div key="a1-child b1"></div>
    <div key="b1-sibling c1"></div>
    <div key="c1-sibling d1"></div>
  </div>
)
