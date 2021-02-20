import connectDB from '../../utils/connectDb'
import User from '../../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

connectDB()

export default async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // validate the name, email and password
        if (!isLength(name, { min: 3, max: 10 })) {
            return res.status(422).json({ msg: 'Name must be 3 to 10 characters long' })
        } else if (!isEmail(email)) {
            return res.status(422).json({ msg: 'The email is not valid' })
        } else if (!isLength(password, { min: 6 })) {
            return res.status(422).json({ msg: 'Password must be 6 characters long' })
        }
        
        // check to see if user already exists
        const user = await User.findOne({ email })
        if (user) {
            return res.status(422).json({ msg: 'User with that email already exists' })
        }

        // if not, hash their password
        const hash = await bcrypt.hash(password, 10)

        // create user
        const newUser = await new User({
            name,
            email,
            password: hash
        }).save()

        // create token for new user and send back
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        res.status(201).json({ token });
    } catch(err) {
        console.error(err)
        res.status(500).json({ msg: 'Error signing up user.' })
    }
}