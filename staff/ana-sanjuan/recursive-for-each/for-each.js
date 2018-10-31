var index = 0

function forEach(nums, callback) {
    if (index < nums.length) {
        callback(nums[index])

        index++

        forEach(nums, callback)
    }
}

module.exports = forEach
