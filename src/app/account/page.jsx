import AccountForm from './account-form'
import { createClient } from '../../../utils/supabase/server'
import Navbar from '../ui/Navbar'

export default async function Account() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  // console.log(user);
  
  return (
    <>
    <Navbar />
    <AccountForm user={user} />
    </>
  )
}