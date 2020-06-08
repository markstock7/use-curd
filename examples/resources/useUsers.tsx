// fetch(`https://api.github.com/repos/${req.query.id}`)

import { useResources } from '../../src'

const Repos: User[] = [
  {
    id: '1',
    name: 'John'
  },
  {
    id: '2',
    name: 'Mark'
  }
]

interface User {
  id: string
  name: string
}
const useRepos = () => {
  return useResources<User>({
    namespace: 'users',
    fetchAll: () => {
      return new Promise(resolve => {
        console.log('我在请求')
        setTimeout(() => {
          resolve(Repos)
        }, 1500)
      })
    },
    create: a => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ id: 3, name: 'Vue' })
        }, 1500)
      })
    },
    delete: id => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ id: 3, name: 'Vue' })
        }, 1500)
      })
    }
  })
}

export default useRepos
