import express from 'express';
import healthController from './healthController'

/**
 * Apps Routes
 *
 */
export default express
    .Router({ mergeParams: true })
    .get('/', healthController.health);
