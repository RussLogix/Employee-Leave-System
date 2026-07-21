import LeaveRequest from "../models/LeaveRequest.js";

export const createLeaveRequest = async (req, res) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason,
    } = req.body;

    if (!leaveType || !startDate || !endDate || !reason?.trim()) {
      return res.status(400).json({
        message: "All leave request fields are required.",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return res.status(400).json({
        message: "Start date and end date must be valid.",
      });
    }

    if (end < start) {
      return res.status(400).json({
        message: "End date cannot be before start date.",
      });
    }

    const leaveRequest = await LeaveRequest.create({
      employee: req.user._id,
      leaveType,
      startDate: start,
      endDate: end,
      reason: reason.trim(),
    });

    const populatedRequest = await leaveRequest.populate(
      "employee",
      "name email",
    );

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to create leave request.",
    });
  }
};

export const getMyLeaveRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({
      employee: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load leave requests.",
    });
  }
};

export const updateMyLeaveRequest = async (req, res) => {
  try {
    const request = await LeaveRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Leave request not found.",
      });
    }

    if (request.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot update this request.",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending requests can be updated.",
      });
    }

    const {
      leaveType,
      startDate,
      endDate,
      reason,
    } = req.body;

    const updatedStartDate = new Date(
      startDate || request.startDate,
    );

    const updatedEndDate = new Date(
      endDate || request.endDate,
    );

    if (updatedEndDate < updatedStartDate) {
      return res.status(400).json({
        message: "End date cannot be before start date.",
      });
    }

    request.leaveType = leaveType || request.leaveType;
    request.startDate = updatedStartDate;
    request.endDate = updatedEndDate;
    request.reason = reason?.trim() || request.reason;

    const updatedRequest = await request.save();

    res.json(updatedRequest);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to update leave request.",
    });
  }
};

export const deleteMyLeaveRequest = async (req, res) => {
  try {
    const request = await LeaveRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Leave request not found.",
      });
    }

    if (request.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot delete this request.",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending requests can be deleted.",
      });
    }

    await request.deleteOne();

    res.json({
      message: "Leave request deleted.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to delete leave request.",
    });
  }
};

export const getAllLeaveRequests = async (req, res) => {
  try {
    const { status = "", search = "" } = req.query;

    const query = {};

    if (
      status &&
      ["Pending", "Approved", "Rejected"].includes(status)
    ) {
      query.status = status;
    }

    let requests = await LeaveRequest.find(query)
      .populate("employee", "name email")
      .sort({ createdAt: -1 });

    if (search.trim()) {
      const searchText = search.trim().toLowerCase();

      requests = requests.filter((request) =>
        request.employee?.name
          ?.toLowerCase()
          .includes(searchText),
      );
    }

    res.json(requests);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load all leave requests.",
    });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected.",
      });
    }

    const request = await LeaveRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Leave request not found.",
      });
    }

    request.status = status;

    const updatedRequest = await request.save();

    await updatedRequest.populate("employee", "name email");

    res.json(updatedRequest);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to update request status.",
    });
  }
};