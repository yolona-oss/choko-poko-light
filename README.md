# Spice server
Spice server is backend of [spice pricess](https://princess-spice.ru)

## Features

Used nestjs and mongodb.

## Getting started

Install dependencies: `npm install`
If dependencies errors, try run `npm install --legacy-peer-deps` or `npm install --force`

## TODO

- [x] fix non relaite images in product
- [-] mail service
- [-] add reset password capability with token usage
- [-] add auth from other services(google)
- [-] events to order creation(update data of product quantity)
- [-] event to admin product editing
- [-] caching for some routes
- [x] move code from internal to common
- [-] append users shcmea to remove my-list entry on deleting
- [-] create cloudinary image removal on update schemas if image not included in new image set
- [-] add cvs import to products schema
- [-] refuce usage of CRUDService generic
- [-] create validators and remove validation inside services
- [-] create by page interface for by page responses
