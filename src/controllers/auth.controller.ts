// ! TWilio configs
import Twilio from 'twilio'
const twilioClient = Twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)

// ! Package imports
import { genSaltSync, hashSync, compareSync } from 'bcrypt'



