import admin from 'firebase-admin'

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null

admin.initializeApp({
  ...(serviceAccount && {
    credential: admin.credential.cert(serviceAccount),
  }),
})

export default admin
