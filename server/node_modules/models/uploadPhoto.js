const router = require("express").Router();
const { User, validate } = require("./user");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name: 'maticht12345',
    api_key: '296937641242215',
    api_secret: '1Pz4aF1QxcosM4hU6fwRS2bwlWY'
})
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {allowed_formats: ['jpg', 'jpeg', 'png', 'webp']}
});

const upload = multer({ storage: storage });
router.put("/:id", upload.array('image', 5), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
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
        if (!userDataToUpdate.image) delete userDataToUpdate.image;
        const resultPromises = req.files.map(file => cloudinary.uploader.upload(file.path, { folder: 'my-folder' }));
        const results = await Promise.all(resultPromises);
        const existingImages = user.image || [];
        const newImages = results.map(result => result.secure_url);
        user.image = existingImages.concat(newImages);
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;

