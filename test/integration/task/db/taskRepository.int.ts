import { taskBuilder } from '../../../common/builders/taskBuilder';
import { TaskRepository, taskRepositoryFactory, TaskTableName } from '../../../../src/task/interfaces/db/taskRepository';
import dbTestSetup from '../../../common/utils/dbTestSetup';
import { Knex } from 'knex';
import { Task, TaskStatus } from '../../../../src/task/domain/task';
import dayjs from 'dayjs';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('taskRepository integration test', () => {
  let db: Knex;
  let taskRepository: TaskRepository;
  let tasksOnDb: Task[];

  beforeAll(async () => {
    const dbClient = await dbTestSetup.createDb();
    taskRepository = taskRepositoryFactory(dbClient);
    db = dbClient.getDb();
  });

  beforeEach(async () => {
    const tasksToAdd = [
      { ...taskBuilder().withId(-1).withName('first').valueOf(), id: undefined },
      { ...taskBuilder().withId(-1).withName('second').valueOf(), id: undefined },
      { ...taskBuilder().withId(-1).withName('third').valueOf(), id: undefined }
    ];
    const ids = await db(TaskTableName).insert(tasksToAdd).returning('id');
    tasksOnDb = tasksToAdd.map((task, index) => ({ ...task, id: +ids[index] }));
  });

  afterEach(async () => {
    await db(TaskTableName).delete();
  });

  afterAll(async () => {
    await dbTestSetup.dropDb();
  });

  it('GIVEN not existing id WHEN findById THEN return null', async () => {
    // GIVEN
    const notExistingId = 164;

    // WHEN
    const result = await taskRepository.findById(notExistingId);

    // THEN
    expect(result).to.be.null;
  });

  it('GIVEN existing id WHEN findById THEN return task', async () => {
    // GIVEN
    const existingTask = tasksOnDb[1];

    // WHEN
    const result = await taskRepository.findById(existingTask.id);

    // THEN
    expect(result).to.deep.equal(existingTask);
  });

  it('GIVEN valid task WHEN insert THEN save task on db', async () => {
    // GIVEN
    const task = taskBuilder().withName('test123').valueOf();

    // WHEN
    const result = await taskRepository.insert(task);

    // THEN
    const onDb = await taskRepository.findById(result.id);
    expect(onDb).to.deep.equal({ ...task, id: result.id });
  });

  it('GIVEN changed task WHEN update THEN update task on db and return updated task', async () => {
    // GIVEN
    const updatedTask = taskBuilder(tasksOnDb[1])
      .withName('updated task')
      .withDescription('updated task description')
      .withColor('#111111')
      .withStatus(TaskStatus.REMOVED)
      .withUpdate(dayjs.utc('2022-01-31 10:10:10'))
      .valueOf();

    // WHEN
    const result = await taskRepository.update(updatedTask);

    // THEN
    const onDb = await taskRepository.findById(updatedTask.id);
    expect(onDb).to.deep.equal(updatedTask);
    expect(result).to.deep.equal(updatedTask);
  });

  it('GIVEN not existing task WHEN update THEN throw exception', async () => {
    // GIVEN
    const notExistingTask = taskBuilder(tasksOnDb[1]).withId(321).valueOf();

    // WHEN

    // THEN
    await expect(taskRepository.update(notExistingTask)).to.eventually.be.rejectedWith('TaskNotFound');
  });
});
