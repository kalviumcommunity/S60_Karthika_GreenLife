const express = require("express");
const { SchemaModel } = require("../mongoConnect");
const { isMerchant } = require("../Authentication/ProtectRoutes");
const { body, validationResult } = require("express-validator");

const PlantRouter = express.Router();

const plantValidationRules = [
    body("ScientificName").notEmpty().withMessage("Scientific name is required"),
    body("PlantName").notEmpty().withMessage("Plant name is required"),
    body("FamilyName").notEmpty().withMessage("Family name is required"),
    body("PlantCost").isFloat({ min: 1 }).withMessage("Plant cost must be a positive number"),
    body("ReferenceLink").isURL().withMessage("Reference link must be a valid URL"),
    body("Uses").notEmpty().withMessage("Uses information is required").isLength({ max: 1000 }).withMessage("Uses must be under 1000 characters"),
    body("Toxicity").notEmpty().withMessage("Toxicity information is required"),
    body("Caution").notEmpty().withMessage("Caution details are required"),
    body("WateringTips").notEmpty().withMessage("Watering tips are required"),
    body("NeedOfSunlight").notEmpty().withMessage("Sunlight requirement is required"),
    body("PlantImage").isURL().withMessage("Plant image must be a valid URL"),
    body("PlantFilter").isArray({ min: 1 }).withMessage("At least one plant filter must be provided"),
    body("Rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5")
];

PlantRouter.get("/get", async (req, res) => {
    try {
        const plantlist = await SchemaModel.find({});
        res.json({ plantlist });
    } catch (err) {
        res.status(500).json({ error: "Error fetching plants" });
    }
});

PlantRouter.get("/getplant/:id", async (req, res) => {
    const plantid = req.params.id;

    try {
        const plant = await SchemaModel.findById(plantid);
        if (!plant) {
            return res.status(404).json({ error: "Plant not found" });
        }
        res.json({ plant });
    } catch (error) {
        res.status(500).json({ error: "Error fetching plant" });
    }
});

PlantRouter.post("/post",plantValidationRules,isMerchant, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newPlant = new SchemaModel(req.body);
        await newPlant.save();
        res.status(201).json({ message: "Plant added successfully", plant: newPlant });
    } catch (error) {
        res.status(500).json({ error: "Error adding plant" });
    }
});

PlantRouter.put("/update/:id",plantValidationRules,isMerchant,async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedPlant = await SchemaModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlant) return res.status(404).json({ error: "Plant not found" });

        res.json({ message: "Plant updated successfully", plant: updatedPlant });
    } catch (error) {
        res.status(500).json({ error: "Error updating plant" });
    }
});

PlantRouter.delete("/delete/:id", isMerchant, async (req, res) => {
    try {
        const plant = await SchemaModel.findByIdAndDelete(req.params.id);
        if (!plant) return res.status(404).json({ error: "Plant not found" });

        res.json({ message: "Plant deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting plant" });
    }
});

module.exports = PlantRouter;
