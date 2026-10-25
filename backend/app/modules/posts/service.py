from app.core.database import db
from app.modules.posts.models import Post

class PostService:
    @staticmethod
    def get_all_posts():
        return db.session.scalars(db.select(Post).order_by(Post.created_at.desc())).all()

    @staticmethod
    def get_by_slug(slug: str):
        return db.session.scalar(db.select(Post).where(Post.slug == slug))

    @staticmethod
    def create_post(data: dict):
        post = Post(
            slug=data.get("slug", "").strip(),
            title=data.get("title", "").strip(),
            description=data.get("description"),
            service=data.get("service"),
            serviceLabel=data.get("serviceLabel"),
            accent=data.get("accent"),
            accentLight=data.get("accentLight"),
            img=data.get("img"),
            faqs=data.get("faqs"),
            content=data.get("content")
        )
        db.session.add(post)
        db.session.commit()
        return post

    @staticmethod
    def update_post(slug: str, data: dict):
        post = db.session.scalar(db.select(Post).where(Post.slug == slug))
        if not post:
            return None
        
        for field in ["title", "description", "service", "serviceLabel", "accent", "accentLight", "img", "faqs", "content"]:
            if field in data:
                setattr(post, field, data[field])
        
        # If slug is updated
        if "new_slug" in data and data["new_slug"]:
            post.slug = data["new_slug"]
            
        db.session.commit()
        return post

    @staticmethod
    def delete_post(slug: str):
        post = db.session.scalar(db.select(Post).where(Post.slug == slug))
        if not post:
            return False
        db.session.delete(post)
        db.session.commit()
        return True
