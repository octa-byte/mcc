import React, {Component} from 'react';
import {
    SkeletonPage,
    SkeletonBodyText,
    Layout,
    Card,
    TextContainer,
    SkeletonDisplayText
} from '@shopify/polaris';

class PageLoading extends Component {
    render(){
        return(

            <SkeletonPage primaryAction secondaryActions={2}>
                <Layout>
                    <Layout.Section>
                    <Card sectioned>
                        <SkeletonBodyText />
                    </Card>
                    <Card sectioned>
                        <TextContainer>
                        <SkeletonDisplayText size="small" />
                        <SkeletonBodyText />
                        </TextContainer>
                    </Card>
                    <Card sectioned>
                        <TextContainer>
                        <SkeletonDisplayText size="small" />
                        <SkeletonBodyText />
                        </TextContainer>
                    </Card>
                    </Layout.Section>
                    <Layout.Section>
                    <Card>
                        <Card.Section>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText lines={2} />
                        </TextContainer>
                        </Card.Section>
                        <Card.Section>
                        <SkeletonBodyText lines={1} />
                        </Card.Section>
                    </Card>
                    <Card subdued>
                        <Card.Section>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText lines={2} />
                        </TextContainer>
                        </Card.Section>
                        <Card.Section>
                        <SkeletonBodyText lines={2} />
                        </Card.Section>
                    </Card>
                    </Layout.Section>
                </Layout>
            </SkeletonPage>
        )
    }
}

export default PageLoading;