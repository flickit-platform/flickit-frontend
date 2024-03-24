# Generated by Django 4.1 on 2024-03-17 08:15

import common.validators
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('account', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AnswerTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('caption', models.CharField(db_column='title', max_length=255)),
                ('index', models.PositiveIntegerField()),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True, db_column='last_modification_time')),
                ('ref_num', models.UUIDField()),
                ('created_by', models.ForeignKey(db_column='created_by', on_delete=django.db.models.deletion.CASCADE, related_name='answer_templates', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Answer Template',
                'verbose_name_plural': 'Answer Templates',
                'db_table': 'fak_answer_option',
            },
        ),
        migrations.CreateModel(
            name='AssessmentKit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50, unique=True)),
                ('title', models.CharField(max_length=100, unique=True)),
                ('summary', models.TextField()),
                ('about', models.TextField()),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True, db_column='last_modification_time')),
                ('is_active', models.BooleanField(db_column='published', default=False)),
                ('is_private', models.BooleanField(default=False)),
                ('last_major_modification_time', models.DateTimeField(auto_now_add=True)),
                ('kit_version_id', models.BigIntegerField()),
                ('created_by', models.ForeignKey(db_column='created_by', on_delete=django.db.models.deletion.CASCADE, related_name='assessment_kit_owner', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Assessment Kit',
                'verbose_name_plural': 'Assessment Kits',
                'db_table': 'fak_assessment_kit',
                'ordering': ['title'],
            },
        ),
        migrations.CreateModel(
            name='AssessmentKitVersion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.SmallIntegerField(choices=[(0, 'ACTIVE'), (1, 'UPDATING'), (2, 'ARCHIVE')])),
                ('assessment_kit', models.ForeignKey(db_column='kit_id', on_delete=django.db.models.deletion.CASCADE, to='baseinfo.assessmentkit')),
            ],
            options={
                'db_table': 'fak_kit_version',
            },
        ),
        migrations.CreateModel(
            name='AssessmentSubject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50)),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True)),
                ('index', models.PositiveIntegerField()),
                ('weight', models.PositiveIntegerField(default=1)),
                ('ref_num', models.UUIDField()),
                ('created_by', models.ForeignKey(db_column='created_by', on_delete=django.db.models.deletion.CASCADE, related_name='assessment_subjects', to=settings.AUTH_USER_MODEL)),
                ('kit_version', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assessment_subjects', to='baseinfo.assessmentkitversion')),
                ('last_modified_by', models.ForeignKey(db_column='last_modified_by', on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'fak_subject',
            },
        ),
        migrations.CreateModel(
            name='ExpertGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('bio', models.CharField(max_length=200)),
                ('about', models.TextField()),
                ('website', models.CharField(blank=True, max_length=200, null=True)),
                ('picture', models.ImageField(null=True, upload_to='expertgroup/images', validators=[common.validators.validate_file_size])),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'permissions': [('manage_expert_group', 'Manage Expert Groups')],
            },
        ),
        migrations.CreateModel(
            name='MaturityLevel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50)),
                ('title', models.CharField(max_length=100)),
                ('value', models.PositiveSmallIntegerField()),
                ('index', models.PositiveSmallIntegerField()),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True, db_column='last_modification_time')),
                ('ref_num', models.UUIDField()),
                ('created_by', models.ForeignKey(db_column='created_by', on_delete=django.db.models.deletion.CASCADE, related_name='maturity_levels', to=settings.AUTH_USER_MODEL)),
                ('kit_version', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='maturity_levels', to='baseinfo.assessmentkitversion')),
                ('last_modified_by', models.ForeignKey(db_column='last_modified_by', on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'MaturityLevel',
                'verbose_name_plural': 'MaturityLevels',
                'db_table': 'fak_maturity_level',
                'unique_together': {('value', 'kit_version'), ('index', 'kit_version'), ('title', 'kit_version'), ('code', 'kit_version')},
            },
        ),
        migrations.CreateModel(
            name='QualityAttribute',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50)),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True)),
                ('index', models.PositiveIntegerField()),
                ('weight', models.PositiveIntegerField()),
                ('ref_num', models.UUIDField()),
                ('assessment_subject', models.ForeignKey(db_column='subject_id', on_delete=django.db.models.deletion.CASCADE, related_name='quality_attributes', to='baseinfo.assessmentsubject')),
                ('created_by', models.ForeignKey(db_column='created_by', on_delete=django.db.models.deletion.CASCADE, related_name='quality_attributes', to=settings.AUTH_USER_MODEL)),
                ('kit_version', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='quality_attributes', to='baseinfo.assessmentkitversion')),
                ('last_modified_by', models.ForeignKey(db_column='last_modified_by', on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Quality Attribute',
                'verbose_name_plural': 'Quality Attributes',
                'db_table': 'fak_attribute',
                'unique_together': {('index', 'assessment_subject'), ('code', 'assessment_subject'), ('title', 'kit_version'), ('code', 'kit_version')},
            },
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50)),
                ('title', models.TextField()),
                ('description', models.TextField(db_column='hint', null=True)),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True, db_column='last_modification_time')),
                ('index', models.IntegerField()),
                ('may_not_be_applicable', models.BooleanField(default=False)),
                ('advisable', models.BooleanField()),
                ('ref_num', models.UUIDField()),
                ('created_by', models.ForeignKey(db_column='created_by', on_delete=django.db.models.deletion.CASCADE, related_name='questions', to=settings.AUTH_USER_MODEL)),
                ('kit_version', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='baseinfo.assessmentkitversion')),
                ('last_modified_by', models.ForeignKey(db_column='last_modified_by', on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Question',
                'verbose_name_plural': 'Questions',
                'db_table': 'fak_question',
            },
        ),
        migrations.CreateModel(
            name='Questionnaire',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50)),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True)),
                ('index', models.PositiveIntegerField()),
                ('ref_num', models.UUIDField()),
                ('created_by', models.ForeignKey(db_column='created_by', on_delete=django.db.models.deletion.CASCADE, related_name='questionnaires', to=settings.AUTH_USER_MODEL)),
                ('kit_version', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questionnaires', to='baseinfo.assessmentkitversion')),
                ('last_modified_by', models.ForeignKey(db_column='last_modified_by', on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Questionnaire',
                'verbose_name_plural': 'Questionnaires',
                'db_table': 'fak_questionnaire',
                'unique_together': {('index', 'kit_version'), ('title', 'kit_version'), ('code', 'kit_version')},
            },
        ),
        migrations.CreateModel(
            name='QuestionnaireSubject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('questionnaire', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='baseinfo.questionnaire')),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='baseinfo.assessmentsubject')),
            ],
            options={
                'db_table': 'fak_subject_questionnaire',
            },
        ),
        migrations.CreateModel(
            name='QuestionImpact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('weight', models.PositiveIntegerField()),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True, db_column='last_modification_time')),
                ('created_by', models.ForeignKey(db_column='created_by', on_delete=django.db.models.deletion.CASCADE, related_name='question_impacts', to=settings.AUTH_USER_MODEL)),
                ('last_modified_by', models.ForeignKey(db_column='last_modified_by', on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('maturity_level', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='question_impacts', to='baseinfo.maturitylevel')),
                ('quality_attribute', models.ForeignKey(db_column='attribute_id', on_delete=django.db.models.deletion.CASCADE, related_name='question_impacts', to='baseinfo.qualityattribute')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='question_impacts', to='baseinfo.question')),
            ],
            options={
                'db_table': 'fak_question_impact',
            },
        ),
        migrations.AddField(
            model_name='question',
            name='quality_attributes',
            field=models.ManyToManyField(through='baseinfo.QuestionImpact', to='baseinfo.qualityattribute'),
        ),
        migrations.AddField(
            model_name='question',
            name='questionnaire',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='baseinfo.questionnaire'),
        ),
        migrations.CreateModel(
            name='OptionValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.DecimalField(decimal_places=2, max_digits=3)),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True, db_column='last_modification_time')),
                ('created_by', models.ForeignKey(db_column='created_by', on_delete=django.db.models.deletion.CASCADE, related_name='OptionValue', to=settings.AUTH_USER_MODEL)),
                ('last_modified_by', models.ForeignKey(db_column='last_modified_by', on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('option', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='option_values', to='baseinfo.answertemplate')),
                ('question_impact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='option_values', to='baseinfo.questionimpact')),
            ],
            options={
                'db_table': 'fak_answer_option_impact',
            },
        ),
        migrations.CreateModel(
            name='LevelCompetence',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.PositiveIntegerField()),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True, db_column='last_modification_time')),
                ('created_by', models.ForeignKey(db_column='created_by', on_delete=django.db.models.deletion.CASCADE, related_name='level_competences', to=settings.AUTH_USER_MODEL)),
                ('last_modified_by', models.ForeignKey(db_column='last_modified_by', on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('maturity_level', models.ForeignKey(db_column='affected_level_id', on_delete=django.db.models.deletion.CASCADE, related_name='level_competences', to='baseinfo.maturitylevel')),
                ('maturity_level_competence', models.ForeignKey(db_column='effective_level_id', on_delete=django.db.models.deletion.CASCADE, to='baseinfo.maturitylevel')),
            ],
            options={
                'db_table': 'fak_level_competence',
            },
        ),
        migrations.CreateModel(
            name='ExpertGroupAccess',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('invite_email', models.EmailField(max_length=254, null=True)),
                ('invite_expiration_date', models.DateTimeField(null=True)),
                ('expert_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='baseinfo.expertgroup')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('expert_group', 'user')},
            },
        ),
        migrations.AddField(
            model_name='expertgroup',
            name='users',
            field=models.ManyToManyField(related_name='expert_groups', through='baseinfo.ExpertGroupAccess', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='assessmentsubject',
            name='questionnaires',
            field=models.ManyToManyField(related_name='assessment_subjects', through='baseinfo.QuestionnaireSubject', to='baseinfo.questionnaire'),
        ),
        migrations.CreateModel(
            name='AssessmentKitTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50, unique=True)),
                ('title', models.CharField(max_length=100, unique=True)),
                ('assessmentkits', models.ManyToManyField(related_name='tags', to='baseinfo.assessmentkit')),
            ],
            options={
                'verbose_name': 'Assessment Kit Tag',
                'verbose_name_plural': 'Assessment Kit Tags',
            },
        ),
        migrations.CreateModel(
            name='AssessmentKitLike',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assessment_kit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='baseinfo.assessmentkit')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AssessmentKitDsl',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dsl_path', models.CharField(max_length=200)),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('json_path', models.CharField(max_length=200)),
                ('last_modification_time', models.DateTimeField(auto_now=True)),
                ('assessment_kit', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='dsl', to='baseinfo.assessmentkit')),
                ('created_by', models.ForeignKey(db_column='created_by', on_delete=django.db.models.deletion.CASCADE, related_name='dsl_owner', to=settings.AUTH_USER_MODEL)),
                ('last_modified_by', models.ForeignKey(db_column='last_modified_by', on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'fak_kit_dsl',
            },
        ),
        migrations.CreateModel(
            name='AssessmentKitAccess',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assessment_kit', models.ForeignKey(db_column='kit_id', on_delete=django.db.models.deletion.CASCADE, to='baseinfo.assessmentkit')),
                ('user', models.ForeignKey(db_column='user_id', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'fak_kit_user_access',
                'unique_together': {('assessment_kit', 'user')},
            },
        ),
        migrations.AddField(
            model_name='assessmentkit',
            name='expert_group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assessmentkits', to='baseinfo.expertgroup'),
        ),
        migrations.AddField(
            model_name='assessmentkit',
            name='last_modified_by',
            field=models.ForeignKey(db_column='last_modified_by', on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='assessmentkit',
            name='users',
            field=models.ManyToManyField(related_name='assessment_kit', through='baseinfo.AssessmentKitAccess', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='answertemplate',
            name='kit_version',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answer_templates', to='baseinfo.assessmentkitversion'),
        ),
        migrations.AddField(
            model_name='answertemplate',
            name='last_modified_by',
            field=models.ForeignKey(db_column='last_modified_by', on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='answertemplate',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answer_templates', to='baseinfo.question'),
        ),
        migrations.AlterUniqueTogether(
            name='question',
            unique_together={('code', 'questionnaire')},
        ),
        migrations.AlterUniqueTogether(
            name='assessmentsubject',
            unique_together={('index', 'kit_version'), ('title', 'kit_version'), ('code', 'kit_version')},
        ),
        migrations.AlterUniqueTogether(
            name='answertemplate',
            unique_together={('index', 'question')},
        ),
    ]
