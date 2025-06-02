const Appointment = require('../models/Appointment');
const User = require('../models/Customer');
const Service = require('../models/Service');

// الحصول على جميع الحجوزات مع تفاصيل العميل والخدمة
// const getAllAppointments = async (req, res) => {
//     try {

//         const filter = { salon_id: req.user._id }; // Assuming the salonId is stored in the user's email
//         console.log("User ID:", req.user._id);
//         console.log("-------------------------------------------------------------");
//         const appointments = await Appointment.find(filter)
//             .populate('user_id', 'name email phone')
//             .populate('service_id', 'name price duration')
//             .sort({ date: 1, startTime: 1 });

//         // get user details from the request
//         if (!appointments || appointments.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No appointments found'
//             });
//         }
//         await Promise.all(
//             appointments.map(async (appointment) => {
//                 try {
//                     // Fetch user details by ObjectId
//                     const userDetails = await User.find({ "user_id": appointment.user_id });
//                     appointment.userInfo = userDetails;
//                     console.log('User details fetched successfully:', userDetails);
//                     console.log('App:', appointment);
//                 } catch (err) {
//                     console.error('Error fetching user details:', err);
//                 }
//                 return appointment;
//             })
//         );
//         // console.log('Appointments with user details===========:', appointments);
//         return res.status(200).json({
//             success: true,
//             count: appointments.length,
//             data: appointments
//         });
//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: 'Server Error',
//             error: err.message
//         });
//     }
// };

const getAllAppointments = async (req, res) => {
    try {
        const filter = { salon_id: req.user._id };
        console.log("User ID:", req.user._id);
        console.log("-------------------------------------------------------------")
        const appointments = await Appointment.find(filter)
            .populate('user_id', 'name email phone')
            .populate('service_id', 'name price duration description duration_minutes category is_discounted discount_price status')
            .sort({ appointment_date: 1, start_time: 1 })
            .exec();

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No appointments found'
            });
        }

        // Transform the data for better frontend consumption
        const formattedAppointments = appointments.map(appointment => ({
            id: appointment._id,
            appointmentId: appointment.Appointment_id,
            customerName: appointment.user_id?.name || 'Unknown',
            customerEmail: appointment.user_id?.email || '',
            customerPhone: appointment.user_id?.phone || '',
            serviceName: appointment.service_id?.name || 'Unknown Service',
            price: appointment.service_id?.price || 0,
            duration: appointment.service_id?.duration_minutes || 'N/A',
            description: appointment.service_id?.description || '',
            category: appointment.service_id?.category || 'General',
            isDiscounted: appointment.service_id?.is_discounted || false,
            discountPrice: appointment.service_id?.discount_price || 0,
            serviceStatus: appointment.service_id?.status || 'visible',
            date: appointment.appointment_date,
            startTime: appointment.start_time,
            endTime: appointment.end_time,
            status: appointment.status
        }));

        return res.status(200).json({
            success: true,
            count: formattedAppointments.length,
            data: formattedAppointments
        });
        // return res.status(200).json({
        //     success: true,
        //     count: appointments.length,
        //     data: appointments
        // });
    } catch (err) {
        console.error('Error fetching appointments:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
};

// إنشاء حجز جديد
const createAppointment = async (req, res) => {
    try {
        const { userId, salonId, serviceId, date, startTime, endTime, notes } = req.body;

        // التحقق من وجود المستخدم والخدمة
        const [user, service] = await Promise.all([
            User.findById(userId),
            Service.findById(serviceId)
        ]);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // التحقق من عدم وجود تعارض في المواعيد
        const conflictingAppointment = await Appointment.findOne({
            salonId,
            date,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        });

        if (conflictingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'Time slot already booked'
            });
        }

        const newAppointment = new Appointment({
            userId,
            salonId,
            serviceId,
            date,
            startTime,
            endTime,
            notes
        });

        const savedAppointment = await newAppointment.save();

        // إضافة الحجز إلى قائمة مواعيد المستخدم
        user.appointments.push(savedAppointment._id);
        await user.save();

        res.status(201).json({
            success: true,
            data: savedAppointment
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: err.message
        });
    }
};

// تحديث حالة الحجز
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Confirmed', 'Cancelled', 'Completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            data: updatedAppointment
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Update failed',
            error: err.message
        });
    }
};

module.exports = {
    getAllAppointments,
    createAppointment,
    updateAppointmentStatus
};