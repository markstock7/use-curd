import * as React from 'react'
import { useRepo } from './resources/useRepos'

const Profile: React.FC<any> = () => {
  const [repos] = useRepo('5')
  return <div>{repos.name ? repos.name : 'NotFound'}</div>
}

export default Profile
