
function forEach(nums, callback, index = 0) {
    if (index < nums.length) {
        callback(nums[index], index)

        index++

        forEach(nums, callback, index)
    }
}

module.exports = forEach
