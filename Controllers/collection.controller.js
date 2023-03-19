import Collection from '../models/collection.schema.js'
import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../utils/customError.js'
import AuthRoles from '../utils/authRoles.js'

/******************************************************
 * @Create_COLLECTION
 * Request Type POST
 * @route http://localhost:5000/api/collection/createCollection
 * @description only admin and moderator can create a collection
 * @parameters collection name
 * @returns Collection Object
 ******************************************************/

export const createCollection = asyncHandler(async (req, res) => {
    //take name from front end
    const { name } = req.body

    console.log("cat name",name);

    // console.log("user role", req.user.role);
    if(req.user.role==AuthRoles.USER)
    {
        throw new CustomError("Only admin can add collections",400)
    }

    if (!name) {
        throw new CustomError("Collection name is required", 400)
    }

   

    //add this name to database
    const collection = await Collection.create({
        name
    })
    //send this response value to frontend
    res.status(200).json({
        success: true,
        message: "Collection created with success",
        collection
    })

})

/******************************************************
 * @UPDATE_COLLECTION
 * Request Type PUT
 * @route http://localhost:5000/api/collection/updateCollection
 * @description only admin and moderator can update a collection
 * @parameters collection name, collection id
 * @returns Success Message
 ******************************************************/

export const updateCollection = asyncHandler(async (req, res) => {
    //existing value to be updates
    const {id: collectionId} = req.params
    //new value to get updated
    const {name} = req.body

    if(req.user.role==AuthRoles.USER)
    {
        throw new CustomError("You are not authorized to access this route",400)
    }

    if (!name) {
        throw new CustomError("Collection name is required", 400)
    }

    let updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        {
            name,
        },
        {
            new: true,
            runValidators: true
        }
    )

    if (!updatedCollection) {
        throw new CustomError("Collection not found", 400)
    }

    //send response to front end
    res.status(200).json({
        success: true,
        message: "Collection updated successfully",
        updateCollection
    })

})


/******************************************************
 * @DELETE_COLLECTION
 * Request Type DELETE
 * @route http://localhost:5000/api/collection/deleteCollection
 * @description only admin and moderator can delete a collection
 * @parameters collection id
 * @returns Success Message
 ******************************************************/

export const deleteCollection = asyncHandler(async(req, res) => {
    const {id: collectionId} = req.params

    if(req.user.role==AuthRoles.USER)
    {
        throw new CustomError("You are not authorized to access this route",400)
    }

    const collectionToDelete = await Collection.findByIdAndDelete(collectionId)

    if (!collectionToDelete) {
        throw new CustomError("Collection not found", 400)
    }

    // collectionToDelete.remove()
    //send response to front end
    res.status(200).json({
        success: true,
        message: "Collection deleted successfully",
        
    })
})

/******************************************************
 * @GETALL_COLLECTION
 * Request Type GET
 * @route http://localhost:5000/api/collection/getAllCollection
 * @description User can request to get all collections
 * @parameters 
 * @returns Collection Object
 ******************************************************/

export const getAllCollections = asyncHandler(async(req, res) => {
    const collections = await Collection.find()


    if (!collections) {
        throw new CustomError("No Collection found", 400)
    }

    res.status(200).json({
        success: true,
        collections
    })
})