import { taskBuilder } from '../../common/builders/taskBuilder';
import { TaskRepository, taskRepositoryFactory, TaskTableName } from '../../../src/task/interfaces/db/taskRepository';
import dbTestSetup from '../../common/utils/dbTestSetup';
import { Knex } from 'knex';
import { Task } from '../../../src/task/domain/task';

describe('taskRepository integration test', () => {
  let db: Knex;
  let taskRepository: TaskRepository;
  let tasksOnDb: Task[];

  beforeAll(async () => {
    await setupEnv();
  });

  async function setupEnv() {
    const dbClient = await dbTestSetup.createDb();
    taskRepository = taskRepositoryFactory(dbClient);
    db = dbClient.getDb();
  }

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

  it('GIVEN not existing id WHEN findById THEN return undefined', async () => {
    // GIVEN
    const notExistingId = 164;

    // WHEN
    const result = await taskRepository.findById(notExistingId);

    // THEN
    expect(result).toBeNull();
  });

  it('GIVEN existing id WHEN findById THEN return task', async () => {
    // GIVEN
    const existingTask = tasksOnDb[1];

    // WHEN
    const result = await taskRepository.findById(existingTask.id);

    // THEN
    expect(result).toStrictEqual(existingTask);
  });

  it('GIVEN valid task WHEN insert THEN save task on db', async () => {
    // GIVEN
    const task = taskBuilder().withName('test123').valueOf();

    // WHEN
    const result = await taskRepository.insert(task);

    // THEN
    const onDb = await taskRepository.findById(result.id);
    expect(onDb).toStrictEqual({ ...task, id: result.id });
  });
});
