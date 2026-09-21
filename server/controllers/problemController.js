const Problem = require("../models/Problem");

// @desc    Get all problems with filters, search, and sorting
// @route   GET /api/problems
exports.getProblems = async (req, res) => {
  try {
    const {
      search,
      topic,
      difficulty,
      status,
      isFavorite,
      sortBy = "lastAccessedAt",
      order = "desc",
    } = req.query;

    const query = {};

    // Search across title, approach, notes, topic
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { approach: searchRegex },
        { notes: searchRegex },
        { topic: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    if (topic && topic !== "All") {
      query.topic = topic;
    }

    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty;
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (isFavorite === "true") {
      query.isFavorite = true;
    }

    // Sort configuration
    const sortOptions = {};
    const sortDirection = order === "asc" ? 1 : -1;

    if (sortBy === "difficulty") {
      // Handled via custom sorting or standard field
      sortOptions.difficulty = sortDirection;
    } else {
      sortOptions[sortBy] = sortDirection;
    }

    const problems = await Problem.find(query).sort(sortOptions);
    res.json({ success: true, count: problems.length, data: problems });
  } catch (error) {
    console.error("getProblems error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single problem
// @route   GET /api/problems/:id
exports.getProblemById = async (req, res) => {
  try {
    const { autoTouch } = req.query;
    let problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    if (autoTouch === "true") {
      problem.lastAccessedAt = new Date();
      await problem.save();
    }

    res.json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new problem
// @route   POST /api/problems
exports.createProblem = async (req, res) => {
  try {
    const {
      title,
      problemUrl,
      platform,
      difficulty,
      topic,
      tags,
      approach,
      timeComplexity,
      spaceComplexity,
      codeSnippet,
      codeLanguage,
      notes,
      status,
      isFavorite,
    } = req.body;

    const problem = await Problem.create({
      title,
      problemUrl,
      platform,
      difficulty,
      topic,
      tags: Array.isArray(tags)
        ? tags
        : tags
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      approach,
      timeComplexity: timeComplexity || "O(N)",
      spaceComplexity: spaceComplexity || "O(1)",
      codeSnippet: codeSnippet || "",
      codeLanguage: codeLanguage || "C++",
      notes: notes || "",
      status: status || "In Progress",
      isFavorite: Boolean(isFavorite),
      lastAccessedAt: new Date(),
    });

    res.status(201).json({ success: true, data: problem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update problem
// @route   PUT /api/problems/:id
exports.updateProblem = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (typeof updateData.tags === "string") {
      updateData.tags = updateData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    res.json({ success: true, data: problem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Mark problem as accessed / reviewed today
// @route   PATCH /api/problems/:id/access
exports.markAsAccessed = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    problem.lastAccessedAt = new Date();
    problem.revisionCount = (problem.revisionCount || 0) + 1;
    await problem.save();

    res.json({ success: true, data: problem, message: "Marked as reviewed!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle favorite
// @route   PATCH /api/problems/:id/favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    problem.isFavorite = !problem.isFavorite;
    await problem.save();

    res.json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete problem
// @route   DELETE /api/problems/:id
exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    res.json({ success: true, message: "Problem deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/stats
exports.getStats = async (req, res) => {
  try {
    const total = await Problem.countDocuments();
    const easyCount = await Problem.countDocuments({ difficulty: "Easy" });
    const mediumCount = await Problem.countDocuments({ difficulty: "Medium" });
    const hardCount = await Problem.countDocuments({ difficulty: "Hard" });

    const masteredCount = await Problem.countDocuments({ status: "Mastered" });
    const inProgressCount = await Problem.countDocuments({
      status: "In Progress",
    });
    const needRevisionCount = await Problem.countDocuments({
      status: "Need Revision",
    });

    // Problems not accessed in > 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const staleProblemsCount = await Problem.countDocuments({
      $or: [
        { lastAccessedAt: { $lt: sevenDaysAgo } },
        { status: "Need Revision" },
      ],
    });

    // Topic breakdown
    const topicStats = await Problem.aggregate([
      { $group: { _id: "$topic", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        total,
        difficulty: {
          easy: easyCount,
          medium: mediumCount,
          hard: hardCount,
        },
        status: {
          mastered: masteredCount,
          inProgress: inProgressCount,
          needRevision: needRevisionCount,
        },
        staleProblemsCount,
        topicStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Seed sample problems
// @route   POST /api/seed
exports.seedProblems = async (req, res) => {
  try {
    const count = await Problem.countDocuments();
    if (count > 0 && !req.query.force) {
      return res.json({
        success: true,
        message: `Database already has ${count} problems. Pass ?force=true to reset.`,
      });
    }

    if (req.query.force) {
      await Problem.deleteMany({});
    }

    const created = await Problem.insertMany(sampleProblems);
    res
      .status(201)
      .json({
        success: true,
        message: `Seeded ${created.length} sample problems!`,
        count: created.length,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
