const router = require("express").Router();
const { User, validate } = require("./user");
const bcrypt = require('bcryptjs');
const Joi = require("joi");

router.put("/:id", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const user = await User.findOne({ email: req.body.email });
        const userDataToUpdate = { ...req.body };
        if (!userDataToUpdate.email) delete userDataToUpdate.email;
        if (!userDataToUpdate.password) delete userDataToUpdate.password;
        if (!userDataToUpdate.role) delete userDataToUpdate.role;
        if (!userDataToUpdate.image) delete userDataToUpdate.image;
        if (!userDataToUpdate.firstName) delete userDataToUpdate.firstName;
        if (!userDataToUpdate.lastName) delete userDataToUpdate.lastName;
        if (!userDataToUpdate.nameOrCompany) delete userDataToUpdate.nameOrCompany;
        if (!userDataToUpdate.areasActivity) delete userDataToUpdate.areasActivity;
        if (!userDataToUpdate.phone1) delete userDataToUpdate.phone1;
        if (!userDataToUpdate.phone2) delete userDataToUpdate.phone2;
        if (!userDataToUpdate.Facebook) delete userDataToUpdate.Facebook;
        if (!userDataToUpdate.TikTok) delete userDataToUpdate.TikTok;
        if (!userDataToUpdate.YouTube) delete userDataToUpdate.YouTube;
        if (!userDataToUpdate.Instagram) delete userDataToUpdate.Instagram;
        if (!userDataToUpdate.WhatsApp) delete userDataToUpdate.WhatsApp;
        if (!userDataToUpdate.Telegram) delete userDataToUpdate.Telegram;
        if (!userDataToUpdate.Viber) delete userDataToUpdate.Viber;
        if (!userDataToUpdate.LinkedIn) delete userDataToUpdate.LinkedIn;
        if (!userDataToUpdate.street) delete userDataToUpdate.street;
        if (!userDataToUpdate.house) delete userDataToUpdate.house;
        if (!userDataToUpdate.apartment) delete userDataToUpdate.apartment;
        if (!userDataToUpdate.zip) delete userDataToUpdate.zip;
        if (!userDataToUpdate.social) delete userDataToUpdate.social;
        if (!userDataToUpdate.city) delete userDataToUpdate.city;
        if (!userDataToUpdate.region) delete userDataToUpdate.region;
        if (!userDataToUpdate.workLocation) delete userDataToUpdate.workLocation;
        if (!userDataToUpdate.profilePoints) delete userDataToUpdate.profilePoints;
        // if (!userDataToUpdate.workingHoursMon.startMinutes1) delete userDataToUpdate.workingHoursMon.startMinutes1;
        // if (!userDataToUpdate.workingHoursMon.startHours1) delete userDataToUpdate.workingHoursMon.startHours1;
        // if (!userDataToUpdate.workingHoursMon.endMinutes1) delete userDataToUpdate.workingHoursMon.endMinutes1;
        // if (!userDataToUpdate.workingHoursMon.endHours1) delete userDataToUpdate.workingHoursMon.endHours1;
        //
        // if (!userDataToUpdate.workingHoursTue.startMinutes2) delete userDataToUpdate.workingHoursTue.startMinutes2;
        // if (!userDataToUpdate.workingHoursTue.startHours2) delete userDataToUpdate.workingHoursTue.startHours2;
        // if (!userDataToUpdate.workingHoursTue.endMinutes2) delete userDataToUpdate.workingHoursTue.endMinutes2;
        // if (!userDataToUpdate.workingHoursTue.endHours2) delete userDataToUpdate.workingHoursTue.endHours2;
        //
        // if (!userDataToUpdate.workingHoursWed.startMinutes3) delete userDataToUpdate.workingHoursWed.startMinutes3;
        // if (!userDataToUpdate.workingHoursWed.startHours3) delete userDataToUpdate.workingHoursWed.startHours3;
        // if (!userDataToUpdate.workingHoursWed.endMinutes3) delete userDataToUpdate.workingHoursWed.endMinutes3;
        // if (!userDataToUpdate.workingHoursWed.endHours3) delete userDataToUpdate.workingHoursWed.endHours3;
        //
        // if (!userDataToUpdate.workingHoursThu.startMinutes4) delete userDataToUpdate.workingHoursThu.startMinutes4;
        // if (!userDataToUpdate.workingHoursThu.startHours4) delete userDataToUpdate.workingHoursThu.startHours4;
        // if (!userDataToUpdate.workingHoursThu.endMinutes4) delete userDataToUpdate.workingHoursThu.endMinutes4;
        // if (!userDataToUpdate.workingHoursThu.endHours4) delete userDataToUpdate.workingHoursThu.endHours4;
        //
        // if (!userDataToUpdate.workingHoursFri.startMinutes5) delete userDataToUpdate.workingHoursFri.startMinutes5;
        // if (!userDataToUpdate.workingHoursFri.startHours5) delete userDataToUpdate.workingHoursFri.startHours5;
        // if (!userDataToUpdate.workingHoursFri.endMinutes5) delete userDataToUpdate.workingHoursFri.endMinutes5;
        // if (!userDataToUpdate.workingHoursFri.endHours5) delete userDataToUpdate.workingHoursFri.endHours5;
        //
        //
        // if (!userDataToUpdate.workingHoursSat.startMinutes6) delete userDataToUpdate.workingHoursSat.startMinutes6;
        // if (!userDataToUpdate.workingHoursSat.startHours6) delete userDataToUpdate.workingHoursSat.startHours6;
        // if (!userDataToUpdate.workingHoursSat.endMinutes6) delete userDataToUpdate.workingHoursSat.endMinutes6;
        // if (!userDataToUpdate.workingHoursSat.endHours6) delete userDataToUpdate.workingHoursSat.endHours6;
        //
        //
        // if (!userDataToUpdate.workingHoursSun.startMinutes7) delete userDataToUpdate.workingHoursSun.startMinutes7;
        // if (!userDataToUpdate.workingHoursSun.startHours7) delete userDataToUpdate.workingHoursSun.startHours7;
        // if (!userDataToUpdate.workingHoursSun.endMinutes7) delete userDataToUpdate.workingHoursSun.endMinutes7;
        // if (!userDataToUpdate.workingHoursSun.endHours7) delete userDataToUpdate.workingHoursSun.endHours7;
        if (!userDataToUpdate.workingHoursMon) delete userDataToUpdate.workingHoursMon;
        if (!userDataToUpdate.workingHoursTue) delete userDataToUpdate.workingHoursTue;
        if (!userDataToUpdate.workingHoursWed) delete userDataToUpdate.workingHoursWed;
        if (!userDataToUpdate.workingHoursThu) delete userDataToUpdate.workingHoursThu;
        if (!userDataToUpdate.workingHoursFri) delete userDataToUpdate.workingHoursFri;
        if (!userDataToUpdate.workingHoursSat) delete userDataToUpdate.workingHoursSat;
        if (!userDataToUpdate.workingHoursSun) delete userDataToUpdate.workingHoursSun;
        if (!userDataToUpdate.description) delete userDataToUpdate.description;
        if (!userDataToUpdate.services) delete userDataToUpdate.services;
        if (!userDataToUpdate.price) delete userDataToUpdate.price;
        if (!userDataToUpdate.image || userDataToUpdate.image.length === 0) delete userDataToUpdate.image;
        if (!userDataToUpdate.rating) delete userDataToUpdate.rating;
        if (!userDataToUpdate.likes) delete userDataToUpdate.likes;
        if (!userDataToUpdate.savedUsers || userDataToUpdate.savedUsers.length === 0) delete userDataToUpdate.savedUsers;
        if (user) {
            return res
                .status(409)
                .send({ message: "User with given email already Exist!" });
        }
        if (userDataToUpdate.password) {
            userDataToUpdate.password = hashPassword;
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            userDataToUpdate,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }
        return res.status(200).json({ data: updatedUser });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;


