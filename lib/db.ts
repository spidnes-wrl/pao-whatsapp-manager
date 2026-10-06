import { supabaseAdmin } from './supabase-admin'

export async function logAction(
  actionType: string,
  targetNumber: string,
  status: 'pending' | 'success' | 'failed',
  resultMessage: string,
  executorIp?: string
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('action_logs')
      .insert([
        {
          action_type: actionType,
          target_number: targetNumber,
          status,
          result_message: resultMessage,
          executor_ip: executorIp,
        },
      ])
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error logging action:', error)
    throw error
  }
}

export async function createSession(
  sessionToken: string,
  ipAddress: string,
  userAgent: string
) {
  try {
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)

    const { data, error } = await supabaseAdmin
      .from('sessions')
      .insert([
        {
          session_token: sessionToken,
          ip_address: ipAddress,
          user_agent: userAgent,
          expires_at: expiresAt.toISOString(),
        },
      ])
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating session:', error)
    throw error
  }
}

export async function verifySession(sessionToken: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single()

    if (error) throw error

    // Vérifier que la session n'a pas expiré
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null
    }

    return data
  } catch (error) {
    console.error('Error verifying session:', error)
    return null
  }
}

export async function getAllLogs(limit = 100) {
  try {
    const { data, error } = await supabaseAdmin
      .from('action_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching logs:', error)
    throw error
  }
}
