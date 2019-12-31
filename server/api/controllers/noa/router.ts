import express from 'express';
import noaController from './noaController';

/**
 * Apps Routes
 *
 */
export default express
    .Router({ mergeParams: true })
    .get('/', noaController.authenticate);
